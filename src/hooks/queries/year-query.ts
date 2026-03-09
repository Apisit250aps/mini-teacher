import { YearWithClasses } from '@/core/domain/data'
import { $api } from '@/lib/client'

type YearQueryContext = {
  data: YearWithClasses[]
}

export const useYearQuery = (): YearQueryContext => {
  const { data: years } = $api.useQuery('get', '/year', undefined, {
    select: (res) => {
      if (res.data) {
        return res.data.map((year) => ({
          ...year,
          createdAt: new Date(year.createdAt),
          updatedAt: new Date(year.updatedAt),
          classes: year.classes.map((cls) => ({
            ...cls,
            createdAt: new Date(cls.createdAt),
            updatedAt: new Date(cls.updatedAt),
          })),
        }))
      }
    },
  })

  return {
    data: years ?? [],
  }
}
