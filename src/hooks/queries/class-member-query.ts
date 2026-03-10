import {
  ClassMemberCreateData,
  ClassMemberQuery,
  ClassMemberWithStudent,
} from '@/core/domain/data'
import { ClassMember } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type ClassMemberDeleteData = {
  classId?: string
  studentId?: string
}

export type ClassMemberMutations = {
  create: (data: ClassMemberCreateData) => Promise<ClassMember>
  remove: (data: ClassMemberDeleteData) => Promise<void>
}

export const useClassMembersByClassQuery = (
  classId: string,
  filter?: ClassMemberQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/class-member/by-class/{classId}',
    {
      params: {
        path: { classId },
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<ClassMemberWithStudent[]>(res, []),
      enabled: !!classId,
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useClassMemberMutations = (): ClassMemberMutations => {
  const createMutation = useApiMutationWithDates('post', '/class-member')
  const deleteMutation = useApiMutationWithDates('delete', '/class-member')

  const create = (data: ClassMemberCreateData) =>
    mutateApiData<ClassMember, { body: ClassMemberCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create class member',
      },
    )

  const remove = (data: ClassMemberDeleteData) =>
    mutateApiSuccess<{ body: ClassMemberDeleteData }>(
      deleteMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to delete class member',
      },
    )

  return { create, remove }
}
