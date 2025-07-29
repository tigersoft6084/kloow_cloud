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
      const response = await axiosServices.post(
        '/api/app_list',
        {
          rootUrl: 'https://maserver.click'
        },
        { withCredentials: true }
      );
      dispatch({
        type: APP_LIST_WITH_PROXY,
        payload: { appList: response.data.appList }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const runApp = async (user, id, url, server) => {
    try {
      const response = await axiosServices.post('/api/run_app', { user, id, url, server }, { withCredentials: true });
      return { status: true, message: response.data.port };
    } catch (error) {
      return { status: false, message: error.response?.data?.message || error.message };
    }
  };

  const stopApp = async (user, id) => {
    try {
      await axiosServices.post('/api/stop_app', { user, id }, { withCredentials: true });
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
