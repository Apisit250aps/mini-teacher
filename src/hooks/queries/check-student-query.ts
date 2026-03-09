import {
  CheckStudentCreateData,
  CheckStudentQuery,
  CheckStudentUpdateData,
  CheckStudentWithRelations,
} from '@/core/domain/data'
import { CheckStudent } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type CheckStudentMutations = {
  create: (data: CheckStudentCreateData) => Promise<CheckStudent>
  update: (id: string, data: CheckStudentUpdateData) => Promise<CheckStudent>
  remove: (id: string) => Promise<void>
}

export const useCheckStudentsByCheckDateQuery = (
  checkDateId: string,
  filter?: CheckStudentQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/check-student/by-check-date/{checkDateId}',
    {
      params: {
        path: { checkDateId },
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<CheckStudentWithRelations[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useCheckStudentUniqueQuery = (
  checkDateId: string,
  studentId: string,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/check-student/unique',
    {
      params: {
        query: { checkDateId, studentId },
      },
    },
    {
      select: (res) => selectData<CheckStudentWithRelations | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useCheckStudentByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/check-student/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<CheckStudentWithRelations | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useCheckStudentMutations = (): CheckStudentMutations => {
  const createMutation = useApiMutationWithDates('post', '/check-student')
  const updateMutation = useApiMutationWithDates('patch', '/check-student/{id}')
  const deleteMutation = useApiMutationWithDates(
    'delete',
    '/check-student/{id}',
  )

  const create = (data: CheckStudentCreateData) =>
    mutateApiData<CheckStudent, { body: CheckStudentCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create check student',
      },
    )

  const update = (id: string, data: CheckStudentUpdateData) =>
    mutateApiData<
      CheckStudent,
      { params: { path: { id: string } }; body: CheckStudentUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update check student',
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
        fallbackMessage: 'Failed to delete check student',
      },
    )

  return { create, update, remove }
}
