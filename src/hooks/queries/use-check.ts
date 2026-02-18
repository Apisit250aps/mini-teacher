import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { onSettledToast } from '@/lib/utils/hooks'

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
      onSettled: onSettledToast,
    },
  )

  const studentCheck = $api.useMutation(
    'put',
    '/year/{yearId}/class/{classId}/check/{checkDateId}/student',
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
