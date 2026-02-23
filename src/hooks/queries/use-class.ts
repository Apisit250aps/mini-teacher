import { $api } from '@/lib/client'
import { useClassContext } from '@/hooks/app/use-class'
import { toast } from 'sonner'
import type { CreateClass, UpdateClass } from '@/models/domain'

export const useGetClassMembers = (classId?: string) => {
  const { activeClass } = useClassContext()

  const query = $api.useQuery(
    'get',
    '/class/{classId}/member',
    {
      params: {
        path: {
          classId: (activeClass?.id ?? classId) as string,
        },
      },
      enabled: !!activeClass?.id || !!classId,
    },
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
  return query
}

export const useClassQueries = () => {
  const create = $api.useMutation('post', '/class', {
    onSettled(data, _error, _variables, _onMutateResult, context) {
      if (!data) return
      if (!data.success) {
        toast.error(data.message, {
          description: data.error,
        })
        return
      }
      toast.success(data.message)
      context.client.refetchQueries({})
    },
  })
  const update = $api.useMutation('put', '/class/{classId}', {
    onSettled(data, _error, _variables, _onMutateResult, context) {
      if (!data) return
      if (!data.success) {
        toast.error(data.message, {
          description: data.error,
        })
        return
      }
      toast.success(data.message)
      context.client.refetchQueries({})
    },
  })
  const remove = $api.useMutation('delete', '/class/{classId}', {
    onSettled(data, _error, _variables, _onMutateResult, context) {
      if (!data) return
      if (!data.success) {
        toast.error(data.message, {
          description: data.error,
        })
        return
      }
      toast.success(data.message)
      context.client.refetchQueries({})
    },
  })

  const addOrRemoveMember = $api.useMutation('put', '/class/{classId}/member', {
    onSettled(data, _error, _variables, _onMutateResult, context) {
      if (!data) return
      if (!data.success) {
        toast.error(data.message, {
          description: data.error,
        })
        return
      }
      toast.success(data.message)
      context.client.refetchQueries({})
    },
  })

  const addMember = $api.useMutation('post', '/class/{classId}/member', {
    onSettled(data, _error, _variables, _onMutateResult, context) {
      if (!data) return
      if (!data.success) {
        toast.error(data.message, {
          description: data.error,
        })
        return
      }
      toast.success(data.message)
      context.client.refetchQueries({})
    },
  })

  const onCreate = (
    data: Pick<CreateClass, 'year' | 'name' | 'subject'> &
      Partial<Pick<CreateClass, 'description' | 'isActive'>>,
  ) => {
    return create.mutateAsync({
      body: data,
    })
  }

  const onUpdate = (classId: string, data: Omit<UpdateClass, 'updatedAt'>) => {
    return update.mutateAsync({
      params: {
        path: {
          classId: classId,
        },
      },
      body: data,
    })
  }

  const onDelete = (classId: string) => {
    return remove.mutateAsync({
      params: {
        path: {
          classId: classId,
        },
      },
    })
  }

  return {
    create,
    update,
    remove,
    addOrRemoveMember,
    addMember,
    onCreate,
    onUpdate,
    onDelete,
  }
}
