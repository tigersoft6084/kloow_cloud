import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { LOGIN, LOGOUT } from 'reducers/actions';
import authReducer, { initialState } from 'reducers/auth';

import { sleep } from 'utils/common';
import axios from 'utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const extractErrorMessage = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const contentDiv = doc.querySelector('.wc-block-components-notice-banner__content');
    return contentDiv ? contentDiv.textContent.trim() : null;
  };

  const getLoginNonce = async () => {
    try {
      const response = await axios.get('/api/login_nonce');
      return response.data.nonce;
    } catch (error) {
      return null;
    }
  };

  const login = async (values) => {
    try {
      const response = await axios.post('/api/login', values);

      const { redirected, responseBody } = response.data;

      if (redirected) {
        dispatch({ type: LOGIN, payload: { user: values.username } });
        return { status: true, message: '' };
      } else {
        return { status: false, message: extractErrorMessage(responseBody) || 'Failed to login' };
      }
    } catch (error) {
      return { status: false, message: `Failed to login` };
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

  const logout = async () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        getLoginNonce,
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
