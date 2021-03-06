/* eslint-disable comma-dangle */
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
        
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response } = error;

    if (response) {
      const {
        data: { message },
      } = response;

      throw new Error(message);
    }

    return Promise.reject(error);
  }
);


export default api;
