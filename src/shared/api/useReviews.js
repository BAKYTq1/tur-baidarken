import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPublishedReviews, postReview } from './reviewsApi'
import { useI18n } from '../i18n'

export function usePublishedReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: getPublishedReviews,
    retry: false,
  })
}

export function useAddReview() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: postReview,
    retry: false,
    onSuccess: () => {
      alert(t('publicUi.reviewCta.success'))
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error) => {
      console.error('Ошибка при отправке отзыва:', error)
      const message = error?.response?.data?.error?.message
      const fallback = error?.response?.status === 429
        ? t('publicUi.reviewCta.rate_limit')
        : t('publicUi.reviewCta.submit_error')
      alert(message || fallback)
    },
  })
}
