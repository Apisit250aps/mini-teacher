import { $api } from '@/lib/client'
import { useYearContext } from '@/hooks/app/use-year'

type LegacyStudentMutationArgs = {
  params: {
    path: {
      studentId: string
    }
  }
  body?: {
    code?: string
    prefix?: string | null
    firstName?: string
    lastName?: string
    nickname?: string | null
    teacherId?: string
  }
}

export const useStudentQueries = () => {
  const { activeYear } = useYearContext()

  const list = $api.useQuery('get', '/student/by-teacher/{teacherId}', {
    params: {
      path: {
        teacherId: activeYear.userId as string,
      },
    },
    enabled: !!activeYear.userId,
  })

  const createMutation = $api.useMutation('post', '/student')
  const updateMutation = $api.useMutation('patch', '/student/{id}')
  const removeMutation = $api.useMutation('delete', '/student/{id}')

  const create = {
    mutateAsync: (
      args: { body: LegacyStudentMutationArgs['body'] },
      options?: Parameters<typeof createMutation.mutateAsync>[1],
    ) =>
      createMutation.mutateAsync(
        {
          body: {
            teacherId: args.body?.teacherId ?? (activeYear.userId as string),
            code: args.body?.code ?? '',
            prefix: args.body?.prefix,
            firstName: args.body?.firstName ?? '',
            lastName: args.body?.lastName ?? '',
            nickname: args.body?.nickname,
          },
        },
        options,
      ),
    isPending: createMutation.isPending,
  }

  const update = {
    mutateAsync: (
      args: LegacyStudentMutationArgs,
      options?: Parameters<typeof updateMutation.mutateAsync>[1],
    ) =>
      updateMutation.mutateAsync(
        {
          params: {
            path: {
              id: args.params.path.studentId,
            },
          },
          body: args.body ?? {},
        },
        options,
      ),
    isPending: updateMutation.isPending,
  }

  const remove = {
    mutateAsync: (
      args: Omit<LegacyStudentMutationArgs, 'body'>,
      options?: Parameters<typeof removeMutation.mutateAsync>[1],
    ) =>
      removeMutation.mutateAsync(
        {
          params: {
            path: {
              id: args.params.path.studentId,
            },
          },
        },
        options,
      ),
    isPending: removeMutation.isPending,
  }

  return {
    list,
    create,
    update,
    remove,
  }
}
