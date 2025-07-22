import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { APP_LIST_WITH_PROXY } from 'reducers/actions';
import MainReducer, { initialState } from 'reducers/main';

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MainReducer, initialState);

  const getAppList = async () => {
    try {
      const response = await axios.post('/api/app_list', {
        rootUrl: 'https://maserver.click'
      });
      console.log(response);
      dispatch({
        type: APP_LIST_WITH_PROXY,
        payload: { appList: response.data.appList }
      });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.message };
    }
  };

  const runApp = async (user, id, url, server) => {
    try {
      const response = await axios.post('/api/run_app', { user, id, url, server });
      return { status: true, message: response.data.port };
    } catch (error) {
      console.log('error', error);
      return { status: false, message: error.message };
    }
  };

  const stopApp = async (user, id) => {
    try {
      await axios.post('/api/stop_app', { user, id });
      return { status: true, message: '' };
    } catch (error) {
      return { status: false, message: error.message };
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
