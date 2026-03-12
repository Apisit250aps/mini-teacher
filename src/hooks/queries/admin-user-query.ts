import { User } from '@/core/domain/entities'
import { useApiQueryWithDates } from '@/lib/client'
import { selectData } from './_shared'

export const useAdminUsersQuery = () => {
  const query = useApiQueryWithDates(
    'get',
    '/admin/users',
    {},
    { select: (res) => selectData<User[]>(res, []) },
  )
  return { data: query.data ?? [], isLoading: query.isPending, query }
}
