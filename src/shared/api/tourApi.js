import { $api } from './axiosInstance'

export async function getTours() {
  const response = await $api.get('/tours')
  const { data } = response

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items

  throw new Error('Некорректный формат ответа при загрузке туров')
}

export async function getTour(id) {
  const response = await $api.get(`/tours/${encodeURIComponent(id)}`)
  return response.data
}
