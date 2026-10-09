import { $api } from './axiosInstance'

export async function postReview({ tourId, reviewData }) {
  const response = await $api.post(
    `/tours/${encodeURIComponent(tourId)}/reviews`,
    reviewData,
  )
  return response.data
}
