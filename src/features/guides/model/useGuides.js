import { useQuery } from '@tanstack/react-query'
import { getGuides } from '../../../shared/api/guidesApi'

export function useGuides() {
  return useQuery({
    queryKey: ['guides'],
    queryFn: getGuides,
  })
}
