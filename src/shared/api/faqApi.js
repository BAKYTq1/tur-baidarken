import { $api } from './axiosInstance'

export const getFaqList = async (lang) => {
  const response = await $api.get('/faq', {
    params: lang ? { lang } : {},
  })

  return response.data
}
