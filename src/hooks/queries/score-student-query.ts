import {
  ScoreStudentCreateData,
  ScoreStudentQuery,
  ScoreStudentUpdateData,
  ScoreWithStudent,
} from '@/core/domain/data'
import { Score } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type ScoreStudentMutations = {
  create: (data: ScoreStudentCreateData) => Promise<Score>
  update: (id: string, data: ScoreStudentUpdateData) => Promise<Score>
  remove: (id: string) => Promise<void>
}

export const useScoreStudentsByAssignmentQuery = (
  assignmentId: string,
  filter?: ScoreStudentQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/score-student/by-assignment/{assignmentId}',
    {
      params: {
        path: { assignmentId },
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<ScoreWithStudent[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useScoreStudentUniqueQuery = (
  assignmentId: string,
  studentId: string,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/score-student/unique',
    {
      params: {
        query: { assignmentId, studentId },
      },
    },
    {
      select: (res) => selectData<Score | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useScoreStudentMutations = (): ScoreStudentMutations => {
  const createMutation = useApiMutationWithDates('post', '/score-student')
  const updateMutation = useApiMutationWithDates('patch', '/score-student/{id}')
  const deleteMutation = useApiMutationWithDates(
    'delete',
    '/score-student/{id}',
  )

  const create = (data: ScoreStudentCreateData) =>
    mutateApiData<Score, { body: ScoreStudentCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create score student',
      },
    )

  const update = (id: string, data: ScoreStudentUpdateData) =>
    mutateApiData<
      Score,
      { params: { path: { id: string } }; body: ScoreStudentUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update score student',
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
        fallbackMessage: 'Failed to delete score student',
      },
    )

  return { create, update, remove }
}
