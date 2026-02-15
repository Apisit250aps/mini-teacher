import { $api } from '@/lib/client'
import { useYearContext } from '@/hooks/app/use-year'
import { useClassContext } from '../app/use-class'

export const useGetClassMembers = (classId?: string) => {
  const { classActive } = useClassContext()
  return $api.useQuery('get', '/class/{classId}/member', {
    params: {
      path: { classId: (classActive?.id ?? classId) as string },
    },
  })
}

export const useClassQueries = () => {
  const { activeYear } = useYearContext()
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
