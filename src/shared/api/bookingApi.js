import { $api } from './axiosInstance'

export async function createBookingRequest(bookingData) {
  const response = await $api.post('/booking-requests', bookingData)
  return response.data
}
