import {
  UserCreateData,
  UserUpdateData,
  UserWithYears,
} from '@/core/domain/data'
import { User } from '@/core/domain/entities'
import { useApiMutationWithDates, useApiQueryWithDates } from '@/lib/client'
import { mutateApiData, mutateApiSuccess } from '@/lib/utils'
import { selectData } from './_shared'

export type UserMutations = {
  create: (data: UserCreateData) => Promise<User>
  update: (id: string, data: UserUpdateData) => Promise<User>
  remove: (id: string) => Promise<void>
}

export const useUserByEmailQuery = (email: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/user/by-email',
    {
      params: {
        query: { email },
      },
    },
    {
      select: (res) => selectData<UserWithYears | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useUserByIdQuery = (id: string) => {
  const query = useApiQueryWithDates(
    'get',
    '/user/{id}',
    {
      params: {
        path: { id },
      },
    },
    {
      select: (res) => selectData<UserWithYears | null>(res, null),
    },
  )

  return {
    data: query.data,
    isLoading: query.isPending,
    query,
  }
}

export const useUserMutations = (): UserMutations => {
  const createMutation = useApiMutationWithDates('post', '/user')
  const updateMutation = useApiMutationWithDates('patch', '/user/{id}')
  const deleteMutation = useApiMutationWithDates('delete', '/user/{id}')

  const create = (data: UserCreateData) =>
    mutateApiData<User, { body: UserCreateData }>(
      createMutation.mutateAsync,
      { body: data },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to create user',
      },
    )

  const update = (id: string, data: UserUpdateData) =>
    mutateApiData<
      User,
      { params: { path: { id: string } }; body: UserUpdateData }
    >(
      updateMutation.mutateAsync,
      {
        params: { path: { id } },
        body: data,
      },
      {
        queryAction: 'invalidate',
        fallbackMessage: 'Failed to update user',
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
        fallbackMessage: 'Failed to delete user',
      },
    )

  return { create, update, remove }
}
