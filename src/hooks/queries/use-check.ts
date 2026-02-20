import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { onSettledToast } from '@/lib/utils/hooks'

export const useGetClassCheckDates = (classId?: string) => {
  const { activeClass } = useClassContext()
  const query = $api.useQuery(
    'get',
    '/class/{classId}/check',
    {
      params: {
        path: {
          classId: (activeClass?.id ?? classId) as string,
        },
      },
      enabled: (!!activeClass?.id || !!classId),
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
  const { activeClass } = useClassContext()

  const list = $api.useQuery(
    'get',
    '/class/{classId}/check',
    {
      params: {
        path: {
          classId: activeClass?.id as string,
        },
      },
      enabled: !!activeClass?.id,
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
    '/class/{classId}/check',
    {
      onSettled: onSettledToast,
    },
  )

  const studentCheck = $api.useMutation(
    'put',
    '/class/{classId}/check/{checkDateId}/student',
    {
      onSettled: onSettledToast,
    },
  )

  return {
    list,
    create,
    studentCheck,
  }
}
