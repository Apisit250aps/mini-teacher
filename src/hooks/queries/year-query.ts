import { YearWithClasses } from '@/core/domain/data'
import { $api } from '@/lib/client'

type YearQueryContext = {
  data: YearWithClasses[]
}

export const useYearQuery = (): YearQueryContext => {
  const { data: years } = $api.useQuery('get', '/year', undefined, {
    select: (res) => {
      
    },
  })

  return {
    data: years ?? [],
  }
}
