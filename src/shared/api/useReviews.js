import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postReview } from './reviewsApi'

export function useAddReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postReview,
    retry: false,
    onSuccess: () => {
      alert('Ваш отзыв успешно отправлен и находится на модерации!')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error) => {
      console.error('Ошибка при отправке отзыва:', error)
      const message = error?.response?.data?.error?.message
      const fallback = error?.response?.status === 429
        ? 'Слишком много запросов. Подождите немного и попробуйте снова.'
        : 'Не удалось отправить отзыв'
      alert(message || fallback)
    },
  })
}
