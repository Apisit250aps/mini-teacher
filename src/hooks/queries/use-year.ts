import { $api } from '@/lib/client'
import { onSelectItem, onSettledToast } from '@/lib/utils/hooks'

export const useYearQueries = () => {
  const list = $api.useQuery('get', '/year', undefined, {
    select: onSelectItem,
  })
  const active = $api.useMutation('patch', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  const create = $api.useMutation('post', '/year', {
    onSettled: onSettledToast,
  })
  const update = $api.useMutation('put', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  const remove = $api.useMutation('delete', '/year/{yearId}', {
    onSettled: onSettledToast,
  })
  return {
    list,
    active,
    create,
    update,
    remove,
  }
}
