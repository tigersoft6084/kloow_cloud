import React, { useEffect, useState } from 'react';
import useMain from 'hooks/useMain';
import Loader from 'components/Loader';
import { Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Stack } from '@mui/material';
import useSnackbar from 'hooks/useSnackbar';
import useAuth from 'hooks/useAuth';

const Dashboard = () => {
  const { getAppList, appList, runApp, stopApp } = useMain();
  const { user } = useAuth();

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
      acc[app.id] = false;
      return acc;
    }, {});
    setRunningStatus(initialStatus);
  }, [appList]);

  const run = async (id, url, server) => {
    try {
      setTryRunningStatus((prev) => [...prev, id]);
      const result = await runApp(user.username, id, url, server);
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
      const result = await stopApp(user.username, id);
      if (!result.status) {
        errorMessage(result.message);
      } else {
        setRunningStatus((prev) => ({ ...prev, [id]: '' }));
      }
      setTryRunningStatus((prev) => prev.filter((e) => e !== id));
    } catch (error) {
      errorMessage(`Failed to stop the browser for id ${id}: ${error.message}`);
    }
  };

  useEffect(() => {
    const initialStatus = appList.reduce((acc, app) => {
      acc[app.id] = '';
      return acc;
    }, {});
    setRunningStatus(initialStatus);
  }, [appList]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Stack sx={{ width: '100%', minHeight: `calc(100vh - 48px)` }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 48px)' }}>
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
                          onClick={() => (runningStatus[app.id] !== '' ? stop(app.id) : run(app.id, app.initUrl, app.servers?.[0]))}
                          disabled={tryRunningStatus.includes(app.id)}
                          color={runningStatus[app.id] ? 'error' : 'primary'}
                        >
                          {runningStatus[app.id] ? 'Stop' : 'Run'}
                        </Button>
                        {runningStatus[app.id] && (
                          <Button
                            disableElevation
                            variant="contained"
                            size="small"
                            onClick={() => window.open(`https://46.62.137.213:${runningStatus[app.id]}`, '_blank')}
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
