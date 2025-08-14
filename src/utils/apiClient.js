import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // 실제 백엔드 URL로 교체 필요, 추후 .env 파일로 이동

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
});

export default api;