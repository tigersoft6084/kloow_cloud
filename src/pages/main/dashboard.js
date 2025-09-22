import React, { useEffect, useState } from 'react';
import useMain from 'hooks/useMain';
import Loader from 'components/Loader';
import { Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Stack, IconButton, Typography } from '@mui/material';
import useSnackbar from 'hooks/useSnackbar';
import useAuth from 'hooks/useAuth';
import { LogoutOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { getAppList, appList, runApp, stopApp } = useMain();
  const { logout } = useAuth();

  const { errorMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [runningStatus, setRunningStatus] = useState({}); // Map of id to boolean
  const [tryRunningStatus, setTryRunningStatus] = useState([]);

  useEffect(() => {
    getAppList().then(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const initialStatus = appList.reduce((acc, app) => {
      acc[app.id] = app.port;
      return acc;
    }, {});
    setRunningStatus(initialStatus);
  }, [appList]);

  const run = async (id, url, proxyServer) => {
    try {
      setTryRunningStatus((prev) => [...prev, id]);
      const result = await runApp(id, url, proxyServer);
      if (!result.status) {
        errorMessage(result.message);
      } else {
        setRunningStatus((prev) => ({ ...prev, [id]: result.message }));
      }
      setTryRunningStatus((prev) => prev.filter((e) => e !== id));
    } catch (error) {
      errorMessage(`Failed to run the executable for id ${id}: ${error.message}`);
    }
  };

  const stop = async (id) => {
    try {
      setTryRunningStatus((prev) => [...prev, id]);
      const result = await stopApp(id);
      if (!result.status) {
        errorMessage(result.message);
      } else {
        setRunningStatus((prev) => ({ ...prev, [id]: 0 }));
      }
      setTryRunningStatus((prev) => prev.filter((e) => e !== id));
    } catch (error) {
      errorMessage(`Failed to stop the browser for id ${id}: ${error.message}`);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Stack spacing={3} sx={{ width: '100%', minHeight: `calc(100vh - 48px)` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Application List</Typography>
            <IconButton onClick={logout}>
              <LogoutOutlined />
            </IconButton>
          </Stack>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 90px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appList?.map((app) => (
                  <TableRow key={`app_${app.id}`}>
                    <TableCell>{app.title}</TableCell>
                    <TableCell>{app.description}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Button
                          disableElevation
                          variant="contained"
                          size="small"
                          onClick={() => (runningStatus[app.id] !== 0 ? stop(app.id) : run(app.id, app.initUrl, app.servers?.[0]))}
                          disabled={tryRunningStatus.includes(app.id)}
                          color={runningStatus[app.id] ? 'error' : 'primary'}
                        >
                          {runningStatus[app.id] === 0 ? 'Run' : 'Stop'}
                        </Button>
                        {runningStatus[app.id] !== 0 && (
                          <Button
                            disableElevation
                            variant="contained"
                            size="small"
                            onClick={() => window.open(`https://www.kloow.com:${runningStatus[app.id]}`, '_blank')}
                            color="primary"
                          >
                            View
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </>
  );
};

export default Dashboard;
