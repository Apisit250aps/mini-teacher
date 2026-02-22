import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { onSettledToast } from '@/lib/utils/hooks'

export const useGetScoreAssigns = (classId?: string) => {
  const { activeClass } = useClassContext()


  const query = $api.useQuery(
    'get',
    '/class/{classId}/score',
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
    '/class/{classId}/score',
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
        return res.data ?? []
      },
    },
  )

  const create = $api.useMutation(
    'post',
    '/class/{classId}/score',
    {
      onSettled: onSettledToast,
    },
  )

  const scoreStudent = $api.useMutation(
    'put',
    '/class/{classId}/score/{scoreAssignId}/student',
    {
      onError: (error) => onSettledToast(undefined, error),
    },
  )

  const onInputScore = async (
    scoreAssignId: string,
    studentId: string,
    score: number,
  ) => {
    if (!activeYear.id || !activeClass?.id) return
    await scoreStudent.mutateAsync({
      params: {
        path: {
          classId: activeClass.id,
          scoreAssignId,
        },
      },
      body: {
        studentId,
        score,
      },
    })
  }

  return {
    list,
    create,
    scoreStudent,
    onInputScore,
  }
}
