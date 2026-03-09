import {
  YearCreateData,
  YearQuery,
  YearUpdateData,
  YearWithClasses,
  YearWithOwnerAndClasses,
} from '@/core/domain/data'
import { Year } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type SetActiveYearData = {
  userId?: string
  yearId?: string
}

type YearQueries = {
  data: YearWithClasses[]
  isLoading: boolean
  onCreate: (data: YearCreateData) => Promise<Year>
}

export type YearMutations = {
  create: (data: YearCreateData) => Promise<Year>
  update: (id: string, data: YearUpdateData) => Promise<Year>
  remove: (id: string) => Promise<void>
  setActive: (data: SetActiveYearData) => Promise<void>
}

export const useYearsListQuery = (filter?: YearQuery) => {
  const list = useApiQueryWithDates(
    'get',
    '/year',
    {
      params: {
        query: toFilterQuery(filter),
      },
    },
    {
      select: (res) => selectData<YearWithClasses[]>(res, []),
    },
  )

  return {
    data: list.data ?? [],
    isLoading: list.isPending,
    query: list,
  }
}

export const useYearByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/year/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<YearWithOwnerAndClasses | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useYearActiveByUserQuery = (userId: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/year/active',
    {
      params: {
        query: { userId },
      },
    },
    {
      select: (res) => selectData<Year | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useYearUniqueQuery = (userId: string, year: number, term: number) => {
  const query = useApiQueryWithDates(
    'get',
    '/year/unique',
    {
      params: {
        query: { userId, year, term },
      },
    },
    {
      select: (res) => selectData<Year | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useYearMutations = (): YearMutations => {
  const createMutation = useApiMutationWithDates('post', '/year')
  const updateMutation = useApiMutationWithDates('patch', '/year/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/year/{id}')
  const setActiveMutation = useApiMutationWithDates('patch', '/year/active')

  const create = (data: YearCreateData) =>
    mutateApiData<Year, { body: YearCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create year',
      },
    )

  const update = (id: string, data: YearUpdateData) =>
    mutateApiData<Year, { params: { path: { id: string } }; body: YearUpdateData }>(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update year',
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
        fallbackMessage: 'Failed to delete year',
      },
    )

  const setActive = (data: SetActiveYearData) =>
    mutateApiSuccess<{ body: SetActiveYearData }>(
      setActiveMutation.mutateAsync,
      {
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to set active year',
      },
    )

  return { create, update, remove, setActive }
}

export const useYearQueries = (): YearQueries => {
  const list = useYearsListQuery()
  const mutations = useYearMutations()

  return {
    isLoading: list.isLoading,
    data: list.data,
    onCreate: mutations.create,
  }
}
