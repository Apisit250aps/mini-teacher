import { $api } from '@/lib/client'
import { useYearContext } from '@/hooks/app/use-year'
import { useClassContext } from '@/hooks/app/use-class'
import { toast } from 'sonner'
import { selectArray } from '@/lib/utils/hooks'

export const useGetClassMembers = (classId?: string) => {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()

  const query = $api.useQuery(
    'get',
    '/year/{yearId}/class/{classId}/member',
    {
      params: {
        path: {
          yearId: activeYear.id,
          classId: (activeClass?.id ?? classId) as string,
        },
      },
      enabled: (!!activeClass?.id || !!classId) && !!activeYear.id,
    },
    {
      select: selectArray,
    },
  )
  return query
}

export const useClassQueries = () => {
  const { activeYear } = useYearContext()
  const list = $api.useQuery(
    'get',
    '/year/{yearId}/class',
    {
      params: {
        path: {
          yearId: activeYear.id,
        },
      },
      enabled: !!activeYear.id,
    },
    {
      select: selectArray,
    },
  )

  const create = $api.useMutation('post', '/year/{yearId}/class', {
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
  const update = $api.useMutation('put', '/year/{yearId}/class/{classId}', {
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
  const remove = $api.useMutation('delete', '/year/{yearId}/class/{classId}', {
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
  const addOrRemoveMember = $api.useMutation(
    'put',
    '/year/{yearId}/class/{classId}/member',
    {
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
    },
  )
  const addMember = $api.useMutation(
    'post',
    '/year/{yearId}/class/{classId}/member',
    {
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
    },
  )

  return {
    list,
    create,
    update,
    remove,
    addOrRemoveMember,
    addMember,
  }
}
