import client from '@/lib/client'
import {
  AuthCreateYearService,
  AuthDeleteYearService,
  AuthGetAllYearsService,
  AuthSetActiveYearService,
  AuthUpdateYearService,
} from '@/services/year.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useYearQueries = () => {
  const list = client.useQuery('get', '/api/year')
  const active = useMutation({
    mutationKey: ['YEAR', 'SET_ACTIVE_YEAR'],
    mutationFn: AuthSetActiveYearService,
  })

  const create = useMutation({
    mutationKey: ['YEAR', 'CREATE_YEAR'],
    mutationFn: AuthCreateYearService,
  })

  const update = useMutation({
    mutationKey: ['YEAR', 'UPDATE_YEAR'],
    mutationFn: AuthUpdateYearService,
  })

  const deleted = useMutation({
    mutationKey: ['YEAR', 'DELETE_YEAR'],
    mutationFn: AuthDeleteYearService,
  })

  return {
    list,
    create,
    update,
    deleted,
    active,
  }
}
