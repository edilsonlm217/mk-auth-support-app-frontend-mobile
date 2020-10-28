import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://172.31.255.2:3333', // internal connection
  baseURL: 'http://200.98.203.122:3333/', // VPS connection
});

export default api;
