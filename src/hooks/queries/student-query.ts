import {
  StudentCreateData,
  StudentQuery,
  StudentUpdateData,
  StudentWithRelations,
} from '@/core/domain/data'
import { Student } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type StudentMutations = {
  create: (data: StudentCreateData) => Promise<Student>
  update: (id: string, data: StudentUpdateData) => Promise<Student>
  remove: (id: string) => Promise<void>
}

export const useStudentsByTeacherQuery = (
  teacherId: string,
  filter?: StudentQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/student/by-teacher/{teacherId}',
    {
      params: {
        path: { teacherId },
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<Student[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useStudentByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/student/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<StudentWithRelations | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useStudentMutations = (): StudentMutations => {
  const createMutation = useApiMutationWithDates('post', '/student')
  const updateMutation = useApiMutationWithDates('patch', '/student/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/student/{id}')

  const create = (data: StudentCreateData) =>
    mutateApiData<Student, { body: StudentCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create student',
      },
    )

  const update = (id: string, data: StudentUpdateData) =>
    mutateApiData<
      Student,
      { params: { path: { id: string } }; body: StudentUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update student',
      },
    )

  const remove = (id: string) =>
    mutateApiSuccess<{ params: { path: { id: string } } }>(
      deleteMutation.mutateAsync,
      {
        params: { path: { id } },
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to delete student',
      },
    )

  return { create, update, remove }
}
