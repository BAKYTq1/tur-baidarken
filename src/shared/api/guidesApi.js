import { $api } from './axiosInstance'

export async function getGuides() {
  const response = await $api.get('/guides')
  const { data } = response

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items

  throw new Error('Некорректный формат ответа при загрузке гидов')
}
