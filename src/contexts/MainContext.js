import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { APP_LIST_WITH_PROXY } from 'reducers/actions';
import MainReducer, { initialState } from 'reducers/main';
import useAuth from 'hooks/useAuth';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MainReducer, initialState);

  const { axiosServices } = useAuth();

  const getAppList = async () => {
    try {
      const response = await axiosServices.get('/app_list', { withCredentials: true });
      dispatch({
        type: APP_LIST_WITH_PROXY,
        payload: { appList: response.data.appList }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const runApp = async (id, url, proxyServer) => {
    try {
      const response = await axiosServices.post('/run_app', { id, url, proxyServer }, { withCredentials: true });
      return { status: true, message: response.data.port };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const stopApp = async (id) => {
    try {
      await axiosServices.post('/stop_app', { id }, { withCredentials: true });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  return (
    <MainContext.Provider
      value={{
        ...state,
        getAppList,
        runApp,
        stopApp
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node
};

export default MainContext;
