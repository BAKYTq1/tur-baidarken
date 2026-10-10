import { useQuery } from '@tanstack/react-query'
import { getFaqList } from '../../../shared/api/faqApi'
import { getLang } from '../../../shared/i18n/i18n'

export const useFaq = () => {
  const currentLang = getLang()

  return useQuery({
    queryKey: ['faq', currentLang],
    queryFn: () => getFaqList(currentLang),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}
