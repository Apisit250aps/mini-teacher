import {
  ScoreAssignCreateData,
  ScoreAssignQuery,
  ScoreAssignUpdateData,
  ScoreAssignWithScores,
} from '@/core/domain/data'
import { Assignment } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type ScoreAssignMutations = {
  create: (data: ScoreAssignCreateData) => Promise<Assignment>
  update: (id: string, data: ScoreAssignUpdateData) => Promise<Assignment>
  remove: (id: string) => Promise<void>
}

export const useScoreAssignsByClassQuery = (
  classId: string,
  filter?: ScoreAssignQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/score-assign/by-class/{classId}',
    {
      params: {
        path: { classId },
        query: toFilterQuery(filter),
      },
    },
    {
      enabled: !!classId,
      select: (res) => selectData<ScoreAssignWithScores[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useScoreAssignByIdQuery = (classId: string, assignId: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/score-assign/by-class/{classId}/{assignId}',
    {
      params: {
        path: { classId, assignId },
      },
    },
    {
      select: (res) => selectData<ScoreAssignWithScores | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useScoreAssignMutations = (): ScoreAssignMutations => {
  const createMutation = useApiMutationWithDates('post', '/score-assign')
  const updateMutation = useApiMutationWithDates('patch', '/score-assign/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/score-assign/{id}')

  const create = (data: ScoreAssignCreateData) =>
    mutateApiData<Assignment, { body: ScoreAssignCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create score assign',
      },
    )

  const update = (id: string, data: ScoreAssignUpdateData) =>
    mutateApiData<
      Assignment,
      { params: { path: { id: string } }; body: ScoreAssignUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update score assign',
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
        fallbackMessage: 'Failed to delete score assign',
      },
    )

  return { create, update, remove }
}
