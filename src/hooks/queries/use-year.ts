import { $api } from '@/lib/client'
import { onSelectItem, onSettledToast } from '@/lib/utils/hooks'
import { useYearContext } from '../app/use-year'
import { Year } from '@/models'
import { on } from 'events'

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
  const active = $api.useMutation('patch', '/year/{yearId}')
  const create = $api.useMutation('post', '/year')
  const update = $api.useMutation('put', '/year/{yearId}')
  const remove = $api.useMutation('delete', '/year/{yearId}')

  const onCreate = async (data: Pick<Year, 'year' | 'term'>) => {
    return await create.mutateAsync(
      {
        body: data,
      },
      {
        onSettled: (data, error, _var, _, context) => {
          onSettledToast(data, error)
          context.client.refetchQueries()
        },
      },
    )
  }

  const onUpdate = async (
    yearId: string,
    data: Pick<Year, 'year' | 'term'>,
  ) => {
    return await update.mutateAsync(
      {
        params: {
          path: { yearId },
        },
        body: data,
      },
      {
        onSettled: (data, error, _var, _, context) => {
          onSettledToast(data, error)
          context.client.refetchQueries()
        },
      },
    )
  }

  const onRemove = async (yearId: string) => {
    return await remove.mutateAsync(
      {
        params: {
          path: { yearId },
        },
      },
      {
        onSettled: (data, error, _var, _, context) => {
          onSettledToast(data, error)
          context.client.refetchQueries()
        },
      },
    )
  }

  const onActive = async (yearId: string) => {
    await active.mutateAsync({
      params: {
        path: { yearId },
      },
    })
  }

  return {
    list,
    active,
    create,
    update,
    remove,
    onCreate,
    onUpdate,
    onActive,
    onRemove,
  }
}
