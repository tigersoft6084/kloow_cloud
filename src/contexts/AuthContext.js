import PropTypes from 'prop-types';
import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { sleep } from 'utils/common';
import axios from 'axios';

import useSnackbar from 'hooks/useSnackbar';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { errorMessage } = useSnackbar();

  const axiosServices = axios.create({
    baseURL: '/api/v1',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  axiosServices.interceptors.response.use(
    (response) => response,
    async (error) => {
      let originalRequest = error.config;

      // Handle 403 Forbidden error
      if (error.response?.status === 403) {
        errorMessage(error.response.data.message);
        localStorage.removeItem('isAuthenticated');
        navigate('/auth/login', { replace: true });
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized error
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResult = await refreshAccessToken();
          if (refreshResult.status) {
            localStorage.setItem('isAuthenticated', 'Y');
            return axiosServices(originalRequest);
          } else {
            localStorage.removeItem('isAuthenticated');
            navigate('/auth/login', { replace: true });
            return Promise.reject(new Error('Token refresh failed'));
          }
        } catch (refreshError) {
          localStorage.removeItem('isAuthenticated');
          navigate('/auth/login', { replace: true });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Login function (as provided)
  const login = async (values) => {
    try {
      const response = await axiosServices.post('/login', values, {
        withCredentials: true
      });

      if (response.data.authentication_success) {
        localStorage.setItem('isAuthenticated', 'Y');
        return { status: true, message: 'Login successful' };
      }

      return { status: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Authentication failed'
      };
    }
  };

  // Refresh token function (as provided)
  const refreshAccessToken = async () => {
    try {
      const response = await axiosServices.get('/refresh-token', {
        withCredentials: true
      });

      if (response.data.authentication_success) {
        return { status: true, message: 'Token refreshed successfully' };
      }

      return { status: false, message: response.data.message || 'Token refresh failed' };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Token refresh failed'
      };
    }
  };

  const signup = async (values) => {
    console.log(values);
    await sleep(1000);
    return { status: true, data: '' };
  };

  const forgotPassword = async (values) => {
    console.log(values);
    await sleep(1000);
    return { status: true, data: '' };
  };

  const resetPassword = async (values) => {
    console.log(values);
    await sleep(1000);
    return { status: true, data: '' };
  };

  // Client-side logout function
  const logout = async () => {
    try {
      await axiosServices.get('/logout', { withCredentials: true });
      localStorage.removeItem('isAuthenticated');
      navigate('/auth/login', { replace: true });
      return { status: true, message: 'Logout success' };
    } catch (error) {
      console.error('Logout error:', error);
      return { status: false, message: 'Logout failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        axiosServices,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthContext;
