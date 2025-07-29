import axios from 'axios';

const axiosServices = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Client-side refresh token function
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
          user: response.data.user.username,
          userId: response.data.user.id,
          membership: response.data.user.membership
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

// Set up Axios interceptor
axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest.__isRetryRequest) {
      originalRequest.__isRetryRequest = true;
      const refreshResult = await refreshAccessToken();
      if (refreshResult.status) {
        return axios(originalRequest);
      }
      // Redirect to login on refresh failure
      window.location.href = '/login';
      return Promise.reject({ ...error, message: 'Session expired. Please log in again.' });
    }
    return Promise.reject(error);
  }
);

export default axiosServices;
