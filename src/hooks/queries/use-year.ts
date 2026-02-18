import { $api } from '@/lib/client'
import { toast } from 'sonner'

export const useYearQueries = () => {
  const list = $api.useQuery('get', '/year', undefined, {
    select(res) {
      if (res.success) {
        return res.data
      }
      toast.error(res.message, { description: res.error })
      return []
    },
  })
  const active = $api.useMutation('patch', '/year/{yearId}', {
    onSettled(data) {
      if (data?.success) {
        toast.success(data.message)
      } else {
        toast(data?.message ?? 'Failed to set active year', {
          description: data?.error,
        })
      }
      list.refetch()
    },
  })
  const create = $api.useMutation('post', '/year', {
    onSettled(data, error) {
      console.log(data, error)
      if (error) {
        toast.error(error!.message ?? 'Failed to create year', {
          description: error!.error,
        })
        return
      }
      if (data) {
        toast.success(data.message)
        list.refetch()
        return
      }
    },
  })
  const update = $api.useMutation('put', '/year/{yearId}', {
    onSettled(data) {
      if (data?.success) {
        toast.success(data.message)
      } else {
        toast.error(data?.message ?? 'Failed to update year', {
          description: data?.error,
        })
      }
      list.refetch()
    },
  })
  const deleted = $api.useMutation('delete', '/year/{yearId}', {
    onSettled(data) {
      if (data?.success) {
        toast.success(data.message)
        return data.data
      } else {
        toast.error(data?.message ?? 'Failed to delete year', {
          description: data?.error,
        })
      }
      list.refetch()
    },
  })
  return {
    list,
    create,
    update,
    deleted,
    active,
  }
}
