import { useMutation } from '@tanstack/react-query'
import { createBookingRequest } from './bookingApi'

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBookingRequest,
    retry: false,
    onSuccess: () => {
      alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.')
    },
    onError: (error) => {
      console.error('Ошибка при отправке заявки:', error)
      const message = error?.response?.data?.error?.message || 'Проверьте заполнение полей формы'
      alert(`Ошибка: ${message}`)
    },
  })
}
