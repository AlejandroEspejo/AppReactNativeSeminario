import axios, {AxiosInstance} from 'axios';
import {API_URL} from './config';
function createAxiosInstance(sesionToken: string) {
  const service: AxiosInstance = axios.create({
    baseURL: API_URL, //base url
    timeout: 10000,
  });

  service.interceptors.request.use(
    config => {
      if (sesionToken) {
        config.headers.Authorization = sesionToken;
      }
      return config;
    },
    error => {
      // Do something with request error
      console.log(error); // for debug
      Promise.reject(error);
    },
  );

  // response pre-processing
  service.interceptors.response.use(
    response => {
      // response.data.token = response.headers.Authorization;
      // give token by others operations
      return response.data.serverResponse;
    },
    error => {
      console.log(error.request);
      return Promise.reject(error);
    },
  );
  return service;
}
export default createAxiosInstance;
