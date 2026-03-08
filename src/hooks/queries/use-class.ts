import { $api } from '@/lib/client'
import { useClassContext } from '@/hooks/app/use-class'
import { useYearContext } from '@/hooks/app/use-year'
import { toast } from 'sonner'

type LegacyClassMemberMutationArgs = {
  params: {
    path: {
      classId: string
    }
  }
  body: {
    studentId?: string
  }
}

type LegacyAddMemberArgs = {
  params: {
    path: {
      classId: string
    }
  }
  body: {
    studentId?: string
    teacherId?: string
    code?: string
    prefix?: string | null
    firstName?: string
    lastName?: string
    nickname?: string | null
  }
}

export const useGetClassMembers = (classId?: string) => {
  const { activeClass } = useClassContext()

  const query = $api.useQuery(
    'get',
    '/class-member/by-class/{classId}',
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
  const { activeYear } = useYearContext()

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
  const update = $api.useMutation('patch', '/class/{id}', {
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
  const remove = $api.useMutation('delete', '/class/{id}', {
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

  const removeClassMember = $api.useMutation('delete', '/class-member', {
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

  const addClassMember = $api.useMutation('post', '/class-member', {
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
  const createStudent = $api.useMutation('post', '/student')

  const onCreate = (data: {
    yearId: string
    name: string
    subject: string
    description?: string | null
    isActive?: boolean
  }) => {
    return create.mutateAsync({
      body: data,
    })
  }

  const onUpdate = (
    classId: string,
    data: {
      yearId?: string
      name?: string
      subject?: string
      description?: string | null
      isActive?: boolean
    },
  ) => {
    return update.mutateAsync({
      params: {
        path: {
          id: classId,
        },
      },
      body: data,
    })
  }

  const onDelete = (classId: string) => {
    return remove.mutateAsync({
      params: {
        path: {
          id: classId,
        },
      },
    })
  }

  const addOrRemoveMember = {
    mutateAsync: (
      args: LegacyClassMemberMutationArgs,
      options?: Parameters<typeof removeClassMember.mutateAsync>[1],
    ) =>
      removeClassMember.mutateAsync(
        {
          body: {
            classId: args.params.path.classId,
            studentId: args.body.studentId,
          },
        },
        options,
      ),
    isPending: removeClassMember.isPending,
  }

  const addMember = {
    mutateAsync: async (
      args: LegacyAddMemberArgs,
      options?: Parameters<typeof addClassMember.mutateAsync>[1],
    ) => {
      let studentId = args.body.studentId

      if (!studentId) {
        const createdStudent = await createStudent.mutateAsync({
          body: {
            teacherId: args.body.teacherId ?? (activeYear.userId as string),
            code: args.body.code ?? '',
            prefix: args.body.prefix,
            firstName: args.body.firstName ?? '',
            lastName: args.body.lastName ?? '',
            nickname: args.body.nickname,
          },
        })

        if (!createdStudent.success || !createdStudent.data?.id) {
          throw new Error(createdStudent.message)
        }

        studentId = createdStudent.data.id
      }

      return addClassMember.mutateAsync(
        {
          body: {
            classId: args.params.path.classId,
            studentId,
          },
        },
        options,
      )
    },
    isPending: addClassMember.isPending,
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
