import { $api } from '@/lib/client'
import { toast } from 'sonner'
import { useClassContext } from '@/hooks/app/use-class'
import { onSettledToast } from '@/lib/utils/hooks'

type LegacyCheckDateCreateArgs = {
  params: {
    path: {
      classId: string
    }
  }
  body: {
    date: string
    description?: string | null
    isEditable?: boolean
  }
}

type LegacyStudentCheckArgs = {
  params: {
    path: {
      classId: string
      checkDateId: string
    }
  }
  body: {
    studentId: string
    status: 'DEFAULT' | 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'
  }
}

const toIsoDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toISOString()
}

export const useGetClassCheckDates = (classId?: string) => {
  const { activeClass } = useClassContext()
  const query = $api.useQuery(
    'get',
    '/check-date/by-class/{classId}',
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

export const useCheckQueries = () => {
  const { activeClass } = useClassContext()

  const list = $api.useQuery(
    'get',
    '/check-date/by-class/{classId}',
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

  const createDate = $api.useMutation('post', '/check-date', {
    onSettled: onSettledToast,
  })

  const createStudentCheck = $api.useMutation('post', '/check-student')
  const updateStudentCheck = $api.useMutation('patch', '/check-student/{id}')

  const create = {
    mutateAsync: (
      args: LegacyCheckDateCreateArgs,
      options?: Parameters<typeof createDate.mutateAsync>[1],
    ) =>
      createDate.mutateAsync(
        {
          body: {
            classId: args.params.path.classId,
            date: toIsoDateTime(args.body.date),
            description: args.body.description,
            isEditable: args.body.isEditable,
          },
        },
        options,
      ),
    isPending: createDate.isPending,
  }

  const studentCheck = {
    mutateAsync: async (args: LegacyStudentCheckArgs) => {
      const searchParams = new URLSearchParams({
        checkDateId: args.params.path.checkDateId,
        studentId: args.body.studentId,
      })

      const uniqueResponse = await fetch(
        `/api/check-student/unique?${searchParams.toString()}`,
      )
      const uniquePayload = (await uniqueResponse.json()) as ApiResponse<{
        id?: string
      } | null>

      if (uniquePayload.success && uniquePayload.data?.id) {
        return updateStudentCheck.mutateAsync({
          params: {
            path: {
              id: uniquePayload.data.id,
            },
          },
          body: {
            status: args.body.status,
          },
        })
      }

      return createStudentCheck.mutateAsync({
        body: {
          checkDateId: args.params.path.checkDateId,
          studentId: args.body.studentId,
          status: args.body.status,
        },
      })
    },
    isPending: createStudentCheck.isPending || updateStudentCheck.isPending,
  }

  return {
    list,
    create,
    studentCheck,
  }
}
