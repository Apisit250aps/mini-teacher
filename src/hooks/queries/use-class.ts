import { $api } from '@/lib/client'
import { useYear } from '@/hooks/app/use-year'

export const useGetClassMembers = (classId: string) => {
  return $api.useQuery('get', '/class/{classId}/member', {
    params: {
      path: { classId },
    },
  })
}

export const useClassQueries = () => {
  const { activeYear } = useYear()
  const list = $api.useQuery('get', '/class', {
    params: {
      query: {
        yearId: activeYear?.id,
      },
    },
    enabled: !!activeYear,
  })

  const create = $api.useMutation('post', '/class')
  const update = $api.useMutation('put', '/class/{classId}')
  const remove = $api.useMutation('delete', '/class/{classId}')
  const addOrRemoveMember = $api.useMutation('put', '/class/{classId}/member')
  const addMember = $api.useMutation('post', '/class/{classId}/member')

  return {
    list,
    create,
    update,
    remove,
    addOrRemoveMember,
    addMember,
  }
}
