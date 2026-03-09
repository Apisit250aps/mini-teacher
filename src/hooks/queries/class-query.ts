import {
  ClassCreateData,
  ClassQuery,
  ClassUpdateData,
  ClassWithDetails,
  ClassWithMembers,
} from '@/core/domain/data'
import { Class } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData, toFilterQuery } from './_shared'

export type ClassMutations = {
  create: (data: ClassCreateData) => Promise<Class>
  update: (id: string, data: ClassUpdateData) => Promise<Class>
  remove: (id: string) => Promise<void>
}

export const useClassesByYearQuery = (yearId: string, filter?: ClassQuery) => {
  /**
   * Fetches a list of classes with their members for a specific academic year.
   *
   * @param yearId - The ID of the academic year to fetch classes for
   * @param filter - Optional filter parameters to apply to the query
   *
   * @returns A query object containing:
   * - `data`: An array of classes with their member information, or an empty array if no data is returned
   * - `isLoading`: Whether the query is currently loading
   * - `error`: Any error that occurred during the fetch
   * - `refetch`: Function to manually refetch the data
   *
   * @remarks
   * - The query is only enabled when `yearId` is provided
   * - Results are transformed through the `selectData` function
   * - Supports date-based parameters via `useApiQueryWithDates`
   */
  const query = useApiQueryWithDates(
    'get',
    '/class/by-year/{yearId}',
    {
      params: {
        path: {
          yearId: yearId,
        },
        query: toFilterQuery(filter),
      },
    },
    {
      enabled: !!yearId,
      select: (res) => selectData<ClassWithMembers[]>(res, []),
    },
  )

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    query,
  }
}

export const useClassByYearAndClassIdQuery = (
  yearId: string,
  classId: string,
) => {
  const query = useApiQueryWithDates(
    'get',
    '/class/by-year/{yearId}/{classId}',
    {
      params: {
        path: { yearId, classId },
      },
    },
    {
      select: (res) => selectData<ClassWithDetails | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useClassByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/class/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<ClassWithDetails | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useClassMutations = (): ClassMutations => {
  const createMutation = useApiMutationWithDates('post', '/class')
  const updateMutation = useApiMutationWithDates('patch', '/class/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/class/{id}')

  const create = (data: ClassCreateData) =>
    mutateApiData<Class, { body: ClassCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create class',
      },
    )

  const update = (id: string, data: ClassUpdateData) =>
    mutateApiData<
      Class,
      { params: { path: { id: string } }; body: ClassUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update class',
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
        fallbackMessage: 'Failed to delete class',
      },
    )

  return { create, update, remove }
}
