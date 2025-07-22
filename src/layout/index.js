import PropTypes from 'prop-types';
import React from 'react';
import { Box, Stack } from '@mui/material';
import Snackbar from 'components/Snackbar';

const Layout = ({ children }) => {
  return (
    <Stack>
      <Stack alignItems="center" justifyContent="center" sx={{ width: '100vw', height: '100vh' }}>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Stack>
      <Snackbar />
    </Stack>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
