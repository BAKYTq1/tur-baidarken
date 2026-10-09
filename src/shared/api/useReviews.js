import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postReview } from './reviewsApi'

export function useAddReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      alert('Ваш отзыв успешно отправлен и находится на модерации!')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error) => {
      console.error('Ошибка при отправке отзыва:', error)
      alert(error?.response?.data?.error?.message || 'Не удалось отправить отзыв')
    },
  })
}
