import { useMutation } from '@tanstack/react-query'
import { createBookingRequest } from './bookingApi'
import { useI18n } from '../i18n'

export function useCreateBooking() {
  const { t } = useI18n()
  return useMutation({
    mutationFn: createBookingRequest,
    retry: false,
    onSuccess: () => {
      alert(t('publicUi.booking.success'))
    },
    onError: (error) => {
      console.error('Ошибка при отправке заявки:', error)
      const message = error?.response?.data?.error?.message || t('publicUi.booking.error')
      alert(`${t('publicUi.booking.error_title')}: ${message}`)
    },
  })
}
