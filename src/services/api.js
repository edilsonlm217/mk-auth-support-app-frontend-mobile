import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.3.69:3333', // when localhost
  baseURL: 'http://mk-edge.com.br:3335', // when preprod and prod
});

export default api;
