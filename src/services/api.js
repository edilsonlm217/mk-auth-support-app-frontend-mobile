import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.3.69:3333', // when localhost
  baseURL: 'http://172.31.255.3:3336', // when preprod and prod
});

export default api;
