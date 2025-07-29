const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { exec } = require('child_process');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = 3001;

const JWT_SECRET = 'proxyservicejwttoken';
const JWT_REFRESH_SECRET = 'proxyservicejwtrefreshtoken';

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust to your frontend's domain/port
    credentials: true
  })
);
app.use(bodyParser.json({ limit: '10kb' })); // Limit payload size for security
app.use(cookieParser());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.path}`);
  next();
});

app.post('/api/login', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const { log, pwd } = req.body;

    if (!log || !pwd) {
      return res.status(400).json({ error: 'Missing required fields: username or password' });
    }

    const loginResponse = await fetch('https://maserver.click/wp-json/custom/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ log, pwd })
    });

    const loginResult = await loginResponse.json();

    if (loginResult.status) {
      const membershipResponse = await fetch(
        `https://maserver.click/?ihc_action=api-gate&ihch=o1dWeElW6C9Ra7qY7y0Te4tg0rEp&action=get_user_levels&uid=${loginResult.data.uid}`
      );
      const membershipResult = await membershipResponse.json();

      // Generate access token
      const accessToken = jwt.sign(
        {
          uid: loginResult.data.uid,
          username: log,
          membership: Object.values(membershipResult.response)[0]
        },
        JWT_SECRET,
        { expiresIn: '15m' } // Short-lived access token
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { uid: loginResult.data.uid, username: log },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Longer-lived refresh token
      );

      // Calculate expiration date (7 days from now)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Store refresh token in database
      const sql = 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
      db.run(sql, [loginResult.data.uid, refreshToken, expiresAt], (err) => {
        if (err) {
          console.error('Error storing refresh token:', err.message);
          return res.status(500).json({ message: 'Failed to store refresh token' });
        }
      });

      // Set tokens in HTTP-only cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 1 minute
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        authentication_success: true,
        user: {
          id: loginResult.data.uid,
          username: log,
          membership: Object.values(membershipResult.response)[0]
        }
      });
    } else {
      res.status(401).json({ message: loginResult.data || 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// Refresh token endpoint
app.post('/api/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Verify refresh token exists in database and is not expired
    const sql = 'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > ?';
    db.get(sql, [refreshToken, new Date().toISOString()], async (err, row) => {
      if (err) {
        console.error('Error querying refresh token:', err.message);
        return res.status(500).json({ message: 'Server error during token refresh' });
      }

      if (!row) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        // Fetch user data again to ensure up-to-date membership info
        const membershipResponse = await fetch(
          `https://maserver.click/?ihc_action=api-gate&ihch=o1dWeElW6C9Ra7qY7y0Te4tg0rEp&action=get_user_levels&uid=${decoded.uid}`
        );
        const membershipResult = await membershipResponse.json();

        // Generate new access token
        const newAccessToken = jwt.sign(
          {
            uid: decoded.uid,
            username: decoded.username,
            membership: Object.values(membershipResult.response)[0]
          },
          JWT_SECRET,
          { expiresIn: '15m' }
        );

        // Set new access token in cookie
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000
        });

        res.json({
          authentication_success: true,
          user: {
            id: decoded.uid,
            username: decoded.username,
            membership: Object.values(membershipResult.response)[0]
          }
        });
      } catch (error) {
        console.error('Refresh token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    db.run(sql, [refreshToken], (err) => {
      if (err) {
        console.error('Error deleting refresh token:', err.message);
      }
    });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired access token' });
  }
};

// App list endpoint
app.post('/api/app_list', verifyToken, async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const { rootUrl } = req.body;
    if (!rootUrl) {
      return res.status(400).json({ error: 'Missing required field: rootUrl' });
    }

    const response = await fetch('https://herzliyaserver.click/api/apps/get-apps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rootUrl })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.json({ appList: data.appList || [] });
  } catch (error) {
    console.error(`Error fetching app list: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch app list' });
  }
});

// Run app endpoint
app.post('/api/run_app', verifyToken, async (req, res) => {
  try {
    const { user, id, url, server } = req.body;
    const { default: getPort, portNumbers } = await import('get-port');
    const port = await getPort({ port: portNumbers(10000, 32767) });

    exec(`./kasm/run.sh ${[`${user}-${id}`, `"${url}"`, `http://${server}:3000`, port].join(' ')}`, (error, stdout, stderr) => {
      if (error) return res.status(500).json({ error: error.message });

      const sql = 'INSERT INTO containers (user_id, project_id, container_id, status) VALUES (?, ?, ?, ?)';
      db.run(sql, [user, id, stdout.trim(), 'running'], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true, port });
      });
    });
  } catch (error) {
    console.error(`Error run app: ${error.message}`);
    res.status(500).json({ error: 'Failed to run app' });
  }
});

// Stop app endpoint
app.post('/api/stop_app', verifyToken, async (req, res) => {
  try {
    const { user, id } = req.body;

    db.get('SELECT * FROM containers WHERE user_id = ? and project_id = ? and status = ?', [user, id, 'running'], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Not found' });

      exec(`./kasm/stop.sh ${row.container_id}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }

        const sql = 'UPDATE containers SET status = ? WHERE id = ?';
        db.run(sql, ['stopped', row.id], function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        });
      });
    });
  } catch (error) {
    console.error(`Error stop app: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop app' });
  }
});

// Periodic cleanup of expired refresh tokens (runs daily)
setInterval(() => {
  db.run('DELETE FROM refresh_tokens WHERE expires_at < ?', [new Date().toISOString()], (err) => {
    if (err) {
      console.error('Error cleaning up expired refresh tokens:', err.message);
    } else {
      console.log('Cleaned up expired refresh tokens');
    }
  });
}, 24 * 60 * 60 * 1000); // Run daily

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
