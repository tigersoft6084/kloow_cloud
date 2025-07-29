import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { LOGIN, LOGOUT } from 'reducers/actions';
import authReducer, { initialState } from 'reducers/auth';

import { sleep } from 'utils/common';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const axiosServices = axios.create({
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // Set up Axios interceptor
  axiosServices.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest.__isRetryRequest) {
        originalRequest.__isRetryRequest = true;
        const refreshResult = await refreshAccessToken();
        if (refreshResult.status) {
          return axiosServices(originalRequest);
        }
        // Redirect to login on refresh failure
        window.location.href = '/auth/login';
        return Promise.reject({ ...error, message: 'Session expired. Please log in again.' });
      }
      return Promise.reject(error);
    }
  );

  // Login function (as provided)
  const login = async (values) => {
    try {
      const response = await axiosServices.post('/api/login', values, {
        withCredentials: true
      });

      if (response.data.authentication_success) {
        dispatch({
          type: LOGIN,
          payload: {
            user: response.data.user
          }
        });
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
      const response = await axiosServices.post(
        '/api/refresh-token',
        {},
        {
          withCredentials: true
        }
      );

      if (response.data.authentication_success) {
        dispatch({
          type: LOGIN,
          payload: {
            user: response.data.user
          }
        });
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
      await axiosServices.post('/api/logout', {}, { withCredentials: true });
      dispatch({ type: LOGOUT });
      return { status: true, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      return { status: false, message: 'Logout failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
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
