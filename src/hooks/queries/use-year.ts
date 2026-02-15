import { $api } from '@/lib/client'

export const useYearContextQueries = () => {
  const list = $api.useQuery('get', '/year')
  const active = $api.useMutation('patch', '/year/{yearId}')
  const create = $api.useMutation('post', '/year')
  const update = $api.useMutation('put', '/year/{yearId}')
  const deleted = $api.useMutation('delete', '/year/{yearId}')

  return {
    list,
    create,
    update,
    deleted,
    active,
  }
}
