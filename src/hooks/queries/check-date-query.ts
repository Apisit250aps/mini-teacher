import {
  CheckDateCreateData,
  CheckDateQuery,
  CheckDateUpdateData,
  CheckDateWithStudents,
} from '@/core/domain/data'
import { CheckDate } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type CheckDateMutations = {
  create: (data: CheckDateCreateData) => Promise<CheckDate>
  update: (id: string, data: CheckDateUpdateData) => Promise<CheckDate>
  remove: (id: string) => Promise<void>
}

export const useCheckDatesByClassQuery = (
  classId: string,
  filter?: CheckDateQuery,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/check-date/by-class/{classId}',
    {
      params: {
        path: { classId },
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<CheckDateWithStudents[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useCheckDateByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/check-date/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<CheckDateWithStudents | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useCheckDateMutations = (): CheckDateMutations => {
  const createMutation = useApiMutationWithDates('post', '/check-date')
  const updateMutation = useApiMutationWithDates('patch', '/check-date/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/check-date/{id}')

  const create = (data: CheckDateCreateData) =>
    mutateApiData<CheckDate, { body: CheckDateCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create check date',
      },
    )

  const update = (id: string, data: CheckDateUpdateData) =>
    mutateApiData<
      CheckDate,
      { params: { path: { id: string } }; body: CheckDateUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update check date',
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
        fallbackMessage: 'Failed to delete check date',
      },
    )

  return { create, update, remove }
}
