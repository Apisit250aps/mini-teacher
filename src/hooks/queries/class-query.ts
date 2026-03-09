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
  const query = useApiQueryWithDates(
    'get',
    '/class/by-year/{yearId}',
    {
      params: {
        path: { yearId },
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
