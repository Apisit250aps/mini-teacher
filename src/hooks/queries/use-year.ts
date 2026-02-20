import { $api } from '@/lib/client'
import { onSelectItem, onSettledToast } from '@/lib/utils/hooks'
import { useYearContext } from '../app/use-year'

export const useClassesInYear = () => {
  const { activeYear } = useYearContext()
  const classes = $api.useQuery(
    'get',
    '/year/{yearId}/class',
    {
      params: {
        path: {
          yearId: activeYear.id as string,
        },
      },
    },
    {
      enabled: !!activeYear.id,
      select: onSelectItem,
    },
  )
  return classes
}

export const useYearQueries = () => {
  const list = $api.useQuery('get', '/year', undefined, {
    select: onSelectItem,
  })
  const active = $api.useMutation('patch', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  const create = $api.useMutation('post', '/year', {
    onSettled: onSettledToast,
  })
  const update = $api.useMutation('put', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  const remove = $api.useMutation('delete', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  return {
    list,
    active,
    create,
    update,
    remove,
  }
}
