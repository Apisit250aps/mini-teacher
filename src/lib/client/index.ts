import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from '@/lib/client/api/v1'
import { mapDatesDeep } from '@/lib/utils'

const fetchClient = createFetchClient<paths>({
  baseUrl: '/api',
})

const $api = createClient(fetchClient)

type ApiUseQuery = typeof $api.useQuery
type ApiUseMutation = typeof $api.useMutation

export const useApiQueryWithDates: ApiUseQuery = ((...args: unknown[]) => {
  const method = args[0]
  const url = args[1]
  const init = args[2]
  const options = args[3] as { select?: (data: unknown) => unknown } | undefined
  const queryClient = args[4]

  const originalSelect = options?.select
  const nextOptions = {
    ...(options ?? {}),
    select: (data: unknown) => {
      const mapped = mapDatesDeep(data)
      return originalSelect ? originalSelect(mapped) : mapped
    },
  }

  return ($api.useQuery as (...params: unknown[]) => unknown)(
    method,
    url,
    init,
    nextOptions,
    queryClient,
  )
}) as ApiUseQuery

export const useApiMutationWithDates: ApiUseMutation = ((
  ...args: unknown[]
) => {
  const mutation = ($api.useMutation as (...params: unknown[]) => unknown)(
    ...args,
  ) as ReturnType<ApiUseMutation> & {
    mutateAsync: (...params: unknown[]) => Promise<unknown>
  }

  const originalMutateAsync = mutation.mutateAsync.bind(mutation)
  mutation.mutateAsync = async (...params: unknown[]) => {
    const result = await originalMutateAsync(...params)
    return mapDatesDeep(result)
  }

  return mutation
}) as ApiUseMutation

export { $api }
