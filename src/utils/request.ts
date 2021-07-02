import axios, {AxiosInstance} from 'axios';
import {useContext} from 'react';
import Context from '../context/AppContext';
const service: AxiosInstance = axios.create({
  baseURL: '192.168.100.3', //base url
  timeout: 10000,
});

service.interceptors.request.use(
  config => {
    const localObject = {
      token: null,
    };
    const context = useContext(Context);
    const combObject = {...localObject, ...context};
    if (combObject.token) {
      config.headers.Authorization = combObject.token;
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
    response.headers.authorization;
    response.data.token = response.headers.Authorization;

    return response.data;
  },
  error => {
    console.log('some error');
    return Promise.reject(error);
  },
);

export default service;
