import PropTypes from 'prop-types';
import React from 'react';
import { Stack } from '@mui/material';
import Snackbar from 'components/Snackbar';

const Layout = ({ children }) => {
  return (
    <Stack
      sx={{
        width: '100vw',
        height: '100vh',
        background: 'rgba(22, 23, 30, 1)'
      }}
    >
      {children}
      <Snackbar />
    </Stack>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
