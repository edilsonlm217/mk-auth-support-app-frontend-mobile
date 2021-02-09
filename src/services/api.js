import axios from 'axios';
import appConfig from '../config/app';

const api = axios.create({
  baseURL: appConfig.apiUrl,
  // baseURL: 'http://192.168.137.37:3333', // internal connection
  // baseURL: 'http://200.98.203.122:3333/', // VPS connection
});

export default api;
