import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'

export const useGetClassCheckDates = (classId?: string) => {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  const query = $api.useQuery(
    'get',
    '/year/{yearId}/class/{classId}/check',
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

export const useCheckQueries = () => {
  const { activeYear } = useYearContext()
  const { activeClass } = useClassContext()

  const list = $api.useQuery(
    'get',
    '/year/{yearId}/class/{classId}/check',
    {
      params: {
        path: {
          yearId: activeYear.id,
          classId: activeClass?.id as string,
        },
      },
      enabled: !!activeClass?.id && !!activeYear.id,
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

  const create = $api.useMutation(
    'post',
    '/year/{yearId}/class/{classId}/check',
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
  }
}
