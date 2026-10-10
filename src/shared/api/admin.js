const BASE = import.meta.env.VITE_API_URL || 'https://baiderken.onrender.com/api/v1';
const KEY = 'admin_token';
export const token = {
  get: () => sessionStorage.getItem(KEY),
  set: (t) => sessionStorage.setItem(KEY, t),
  clear: () => sessionStorage.removeItem(KEY),
};

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (token.get()) headers.Authorization = `Bearer ${token.get()}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers, body: form || (body && JSON.stringify(body)) });
  if (res.status === 401 && path !== '/admin/login') {
    token.clear();
    window.location.assign('/admin/login');
    throw new Error('Сессия истекла');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = data?.error;
    const fields = e?.fields ? ': ' + Object.entries(e.fields).map(([k, v]) => `${k} — ${v}`).join('; ') : '';
    throw new Error(e ? e.message + fields : `Ошибка ${res.status}`);
  }
  return data;
}

export const asList = (d) => (Array.isArray(d) ? d : d?.items || d?.data || d?.results || []);

export const adminApi = {
  login: (email, password) => request('/admin/login', { method: 'POST', body: { email, password } }),
  tours: () => request('/admin/tours'),
  tour: (id) => request(`/admin/tours/${id}`),
  createTour: (b) => request('/admin/tours', { method: 'POST', body: b }),
  replaceTour: (id, b) => request(`/admin/tours/${id}`, { method: 'PUT', body: b }),
  archiveTour: (id) => request(`/admin/tours/${id}`, { method: 'DELETE' }),
  bookings: () => request('/admin/bookings'),
  setBookingStatus: (id, status) => request(`/admin/bookings/${id}`, { method: 'PATCH', body: { status } }),
  reviews: () => request('/admin/reviews'),
  setReviewPublished: (id, is_published) => request(`/admin/reviews/${id}`, { method: 'PATCH', body: { is_published } }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/admin/media/images', { method: 'POST', form });
  },
};

// ВСТАВЬТЕ В src/shared/api/admin.js — после функции request() и перед/после adminApi.
// Эндпоинты взяты из вашего swagger.

// 1) в объект adminApi добавьте:
//    deleteReview: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),

// 2) ниже adminApi добавьте:
const crud = (base) => ({
  list: () => request(base),
  get: (id) => request(`${base}/${id}`),
  create: (body) => request(base, { method: 'POST', body }),
  replace: (id, body) => request(`${base}/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`${base}/${id}`, { method: 'DELETE' }),
});

export const guidesApi = crud('/admin/guides');
export const faqApi = crud('/admin/faq');

export const companyApi = {
  get: () => request('/admin/company'),
  save: (body) => request('/admin/company', { method: 'PUT', body }),
};

export const telegramApi = {
  list: () => request('/admin/telegram/chats'),
  // ⚠️ имя поля тела (chat_id) — предположение, сверьте со swagger
  add: (chat_id) => request('/admin/telegram/chats', { method: 'POST', body: { chat_id } }),
  remove: (chatId) => request(`/admin/telegram/chats/${chatId}`, { method: 'DELETE' }),
};