import { YearWithClasses } from '@/core/domain/data'
import { $api } from '@/lib/client'
import { mapDatesDeep } from '@/lib/utils'

type YearQueries = {
  data: YearWithClasses[]
  isLoading: boolean
}

export const useYearQueries = (): YearQueries => {
  const list = $api.useQuery('get', '/year', undefined, {
    select: (res) => mapDatesDeep(res.data) as YearWithClasses[],
  })

  return {
    isLoading: list.isPending,
    data: list.data ?? [],
  }
}
