import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { onSettledToast } from '@/lib/utils/hooks'

type LegacyScoreAssignCreateArgs = {
  params: {
    path: {
      classId: string
    }
  }
  body: {
    name?: string
    title?: string
    description?: string | null
    minScore?: number
    maxScore?: number
    type?: 'ASSIGNMENT' | 'HOMEWORK' | 'QUIZ' | 'EXAM' | 'PROJECT'
    assignDate?: string | null
    finalDate?: string | null
    dueDate?: string | null
    isEditable?: boolean
  }
}

const toIsoDateTimeOrNull = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export const useGetScoreAssigns = (classId?: string) => {
  const { activeClass } = useClassContext()

  const query = $api.useQuery(
    'get',
    '/score-assign/by-class/{classId}',
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
    '/score-assign/by-class/{classId}',
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

  const createAssign = $api.useMutation('post', '/score-assign', {
    onSettled: onSettledToast,
  })

  const createScoreStudent = $api.useMutation('post', '/score-student')
  const updateScoreStudent = $api.useMutation('patch', '/score-student/{id}')

  const create = {
    mutateAsync: (
      args: LegacyScoreAssignCreateArgs,
      options?: Parameters<typeof createAssign.mutateAsync>[1],
    ) =>
      createAssign.mutateAsync(
        {
          body: {
            classId: args.params.path.classId,
            title: args.body.title ?? args.body.name ?? '',
            description: args.body.description,
            minScore: args.body.minScore,
            maxScore: args.body.maxScore,
            type: args.body.type,
            assignDate: toIsoDateTimeOrNull(args.body.assignDate),
            dueDate: toIsoDateTimeOrNull(
              args.body.dueDate ?? args.body.finalDate,
            ),
            isEditable: args.body.isEditable,
          },
        },
        options,
      ),
    isPending: createAssign.isPending,
  }

  const scoreStudent = {
    mutateAsync: async (
      scoreAssignId: string,
      studentId: string,
      score: number,
    ) => {
      const searchParams = new URLSearchParams({
        assignmentId: scoreAssignId,
        studentId,
      })

      const uniqueResponse = await fetch(
        `/api/score-student/unique?${searchParams.toString()}`,
      )
      const uniquePayload = (await uniqueResponse.json()) as ApiResponse<{
        id?: string
      } | null>

      if (uniquePayload.success && uniquePayload.data?.id) {
        return updateScoreStudent.mutateAsync({
          params: {
            path: {
              id: uniquePayload.data.id,
            },
          },
          body: {
            score,
          },
        })
      }

      return createScoreStudent.mutateAsync({
        body: {
          assignmentId: scoreAssignId,
          studentId,
          score,
        },
      })
    },
    isPending: createScoreStudent.isPending || updateScoreStudent.isPending,
  }

  const onInputScore = async (
    scoreAssignId: string,
    studentId: string,
    score: number,
  ) => {
    if (!activeYear.id || !activeClass?.id) return
    await scoreStudent.mutateAsync(scoreAssignId, studentId, score)
  }

  return {
    list,
    create,
    scoreStudent,
    onInputScore,
  }
}
