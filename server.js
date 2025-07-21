const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json({ limit: '10kb' })); // Limit payload size for security
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.path}`);
  next();
});

// Utility function to extract nonce from HTML
const extractNonce = (htmlContent) => {
  const regex = /id="woocommerce-login-nonce"[^>]*value="([^"]+)"/;
  const match = htmlContent.match(regex);
  return match && match[1] ? match[1] : null;
};

// Nonce endpoint
app.get('/api/login_nonce', async (_req, res) => {
  try {
    const { default: fetch } = await import('node-fetch'); // Dynamic import
    const response = await fetch('https://maserver.click/my-account-2/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const htmlContent = await response.text();
    const nonce = extractNonce(htmlContent);
    res.json({ nonce });
  } catch (error) {
    console.error(`Error fetching nonce: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch nonce' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch'); // Dynamic import
    const { username, password, nonce } = req.body;
    if (!username || !password || !nonce) {
      return res.status(400).json({ error: 'Missing required fields: username, password, or nonce' });
    }

    const urlEncodedData = new URLSearchParams({
      login: 'Log in',
      _wp_http_referer: '/my-account-2/',
      username,
      password,
      'woocommerce-login-nonce': nonce
    }).toString();

    const response = await fetch('https://maserver.click/my-account-2/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlEncodedData,
      credentials: 'include'
    });

    const responseBody = await response.text();
    res.json({ redirected: response.redirected, responseBody });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// App list endpoint
app.post('/api/app_list', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch'); // Dynamic import
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
app.post('/api/run_app', async (req, res) => {
  try {
    const { id, url, server } = req.body;

    res.json({ success: true });
  } catch (error) {
    console.error(`Error run app: ${error.message}`);
    res.status(500).json({ error: 'Failed to run app' });
  }
});

// Stop app endpoint
app.post('/api/stop_app', async (req, res) => {
  try {
    const { id } = req.body;

    res.json({ success: true });
  } catch (error) {
    console.error(`Error stop app: ${error.message}`);
    res.status(500).json({ error: 'Failed to stop app' });
  }
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
