import {
  AuthCreateYearService,
  AuthDeleteYearService,
  AuthGetAllYearsService,
  AuthUpdateYearService,
} from '@/services/year.service'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useYearQueries = () => {
  const list = useQuery({
    queryKey: ['YEAR', 'ALL_YEAR'],
    queryFn: AuthGetAllYearsService,
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
  }
}
