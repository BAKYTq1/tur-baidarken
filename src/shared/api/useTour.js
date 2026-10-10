import { useQuery } from '@tanstack/react-query'
import { getTour } from './tourApi'

export function useTour(id) {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => getTour(id),
    enabled: Boolean(id),
  })
}
