import { useQuery } from '@tanstack/react-query'
import { getTours } from './tourApi'

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: getTours,
  })
}
