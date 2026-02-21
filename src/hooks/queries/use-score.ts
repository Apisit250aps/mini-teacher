import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { onSettledToast } from '@/lib/utils/hooks'

export const useGetScoreAssigns = (classId?: string) => {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()

  const query = $api.useQuery(
    'get',
    '/year/{yearId}/class/{classId}/score',
    {
      params: {
        path: {
          yearId: activeYear.id,
          classId: (activeClass?.id ?? classId) as string,
        },
      },
      enabled: !!activeYear.id && (!!activeClass?.id || !!classId),
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
        return res.data ?? []
      },
    },
  )
  return query
}

export const useScoreQueries = () => {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()

  const list = $api.useQuery(
    'get',
    '/year/{yearId}/class/{classId}/score',
    {
      params: {
        path: {
          yearId: activeYear.id,
          classId: activeClass?.id as string,
        },
      },
      enabled: !!activeYear.id && !!activeClass?.id,
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
        return res.data ?? []
      },
    },
  )

  const create = $api.useMutation(
    'post',
    '/year/{yearId}/class/{classId}/score',
    {
      onSettled: onSettledToast,
    },
  )

  const scoreStudent = $api.useMutation(
    'put',
    '/year/{yearId}/class/{classId}/score/{scoreAssignId}/student',
    {
      onSettled: onSettledToast,
    },
  )

  return {
    list,
    create,
    scoreStudent,
  }
}
