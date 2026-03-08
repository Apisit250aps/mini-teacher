'use client'
import { $api } from '@/lib/client'
import { onSettledToast } from '@/lib/utils/hooks'
import { useYearContext } from '../app/use-year'
import { toast } from 'sonner'

export const useClassesInYear = () => {
  const { activeYear } = useYearContext()
  const classes = $api.useQuery(
    'get',
    '/class/by-year/{yearId}',
    {
      params: {
        path: {
          yearId: activeYear.id as string,
        },
      },
    },
    {
      enabled: !!activeYear.id,
      select: (res) => {
        if (!res) return []
        if (!res.success) {
          toast.error(res.message, {
            description: res.error,
          })
          return []
        }
        return res.data
      },
    },
  )
  return classes
}

export const useYearQueries = () => {
  const list = $api.useQuery(
    'get',
    '/year',
    {},
    {
      select: (res) => {
        if (!res) return []
        if (!res.success) {
          toast.error(res.message, {
            description: res.error,
          })
          return []
        }
        return res.data
      },
    },
  )
  const active = $api.useMutation('patch', '/year/active')
  const create = $api.useMutation('post', '/year')
  const update = $api.useMutation('patch', '/year/{id}')
  const remove = $api.useMutation('delete', '/year/{id}')

  const onCreate = async (data: {
    userId?: string
    year: number
    term: number
    description?: string | null
    isActive?: boolean
  }) => {
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
    data: {
      year?: number
      term?: number
      description?: string | null
      isActive?: boolean
    },
  ) => {
    return await update.mutateAsync(
      {
        params: {
          path: { id: yearId },
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
          path: { id: yearId },
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

  const onActive = async (yearId: string, userId?: string) => {
    await active.mutateAsync({
      body: {
        yearId,
        userId,
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
