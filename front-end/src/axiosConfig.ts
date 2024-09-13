import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
