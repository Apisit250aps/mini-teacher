import { $api } from '@/lib/client'
import { useYearContext } from '@/hooks/app/use-year'
import { useClassContext } from '@/hooks/app/use-class'

export const useGetClassMembers = (classId?: string) => {
  const { activeClass } = useClassContext()
  const { activeYear } = useYearContext()
  return $api.useQuery('get', '/year/{yearId}/class/{classId}/member', {
    params: {
      path: {
        yearId: activeYear?.id as string,
        classId: (activeClass?.id ?? classId) as string,
      },
    },
    enabled: (!!activeClass?.id || !!classId) && !!activeYear?.id,
  })
}

export const useClassQueries = () => {
  const { activeYear } = useYearContext()
  const list = $api.useQuery('get', '/year/{yearId}/class', {
    params: {
      path: {
        yearId: activeYear?.id,
      },
    },
    enabled: !!activeYear?.id,
  })

  const create = $api.useMutation('post', '/year/{yearId}/class')
  const update = $api.useMutation('put', '/year/{yearId}/class/{classId}')
  const remove = $api.useMutation('delete', '/year/{yearId}/class/{classId}')
  const addOrRemoveMember = $api.useMutation(
    'put',
    '/year/{yearId}/class/{classId}/member',
  )
  const addMember = $api.useMutation(
    'post',
    '/year/{yearId}/class/{classId}/member',
  )

  return {
    list,
    create,
    update,
    remove,
    addOrRemoveMember,
    addMember,
  }
}
