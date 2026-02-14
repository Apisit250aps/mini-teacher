import { $api } from '@/lib/client'

export const useStudentQueries = () => {
  const list = $api.useQuery('get', '/student')
  const create = $api.useMutation('post', '/student')
  const update = $api.useMutation('put', '/student/{studentId}')
  const remove = $api.useMutation('delete', '/student/{studentId}')

  return {
    list,
    create,
    update,
    remove,
  }
}
