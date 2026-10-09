import axios from 'axios';
import { getLang } from '../i18n/i18n';

export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://baiderken.onrender.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для автоматической отправки текущего языка (RU, EN, KG, JA)
$api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = getLang();
  return config;
});