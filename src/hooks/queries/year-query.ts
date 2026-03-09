import { YearCreateData, YearWithClasses } from '@/core/domain/data'
import { Year } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData } from '@/lib/utils'

type YearQueries = {
  data: YearWithClasses[]
  isLoading: boolean
  onCreate: (data: YearCreateData) => Promise<Year>
}

export const useYearQueries = (): YearQueries => {
  const list = useApiQueryWithDates('get', '/year', undefined, {
    select: (res) => (res as { data?: YearWithClasses[] })?.data ?? [],
  })

  const create = useApiMutationWithDates('post', '/year')

  const onCreate = (data: YearCreateData) =>
    mutateApiData<Year, { body: YearCreateData }>(
      create.mutateAsync,
      {
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create year',
      },
    )

  return {
    isLoading: list.isPending,
    data: list.data ?? [],
    onCreate,
  }
}
