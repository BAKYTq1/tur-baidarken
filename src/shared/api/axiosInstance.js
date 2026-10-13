import axios from 'axios';
import { getLang } from '../i18n/i18n';

export const API_BASE_URL = import.meta.env.VITE_API_URL
  || '/api/v1';

export const $api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, '')}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для автоматической отправки текущего языка (RU, EN, KG, JA)
$api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = getLang();
  return config;
});