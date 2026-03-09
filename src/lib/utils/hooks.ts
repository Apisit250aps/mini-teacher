import { toast } from 'sonner'

type QueryAction = 'invalidate' | 'refetch' | 'none'

type QueryClientLike = {
  invalidateQueries: (filters?: unknown) => unknown
  refetchQueries: (filters?: unknown) => unknown
}

type ApiLikeError = {
  message?: string
  error?: string
}

type ApiLikeResponse = {
  success?: boolean
  message?: string
  error?: string
}

export type ApiSettledOptions = {
  queryAction?: QueryAction
  queryFilters?: unknown
  successMessage?: string
  errorMessage?: string
  onFinally?: () => void
}

export type ApiMutationOptions = ApiSettledOptions & {
  fallbackMessage?: string
}

type MutateAsyncFn<TVariables> = (
  variables: TVariables,
  options?: {
    onSettled?: (...args: unknown[]) => void
  },
) => Promise<ApiResponse<unknown>>

function asApiResponse(value: unknown): ApiLikeResponse | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return value as ApiLikeResponse
}

function asQueryClient(value: unknown): QueryClientLike | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const maybeContext = value as { client?: QueryClientLike }
  if (!maybeContext.client) {
    return undefined
  }

  return maybeContext.client
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const errorLike = error as ApiLikeError
    if (typeof errorLike.message === 'string' && errorLike.message.length > 0) {
      return errorLike.message
    }
    if (typeof errorLike.error === 'string' && errorLike.error.length > 0) {
      return errorLike.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น'
}

export function onSelectItem<T>(res: ApiResponse<T>) {
  if (!res) return []
  if (!res.success) {
    toast.error(res.message, {
      description: res.error,
    })
    return []
  }
  return res.data
}

export function onSettledToast<T>(
  data: ApiResponse<T> | undefined,
  error: ApiResponse<null> | null | undefined,
) {
  if (error) {
    toast.error(error.message, {
      description: error.error,
    })
    return
  }
  if (data) {
    toast.success(data.message)
    return
  }
}

export function createApiSettledHandler(options?: ApiSettledOptions) {
  const queryAction = options?.queryAction ?? 'none'

  return (
    data: unknown,
    error: unknown,
    _variables?: unknown,
    _request?: unknown,
    context?: unknown,
  ) => {
    const response = asApiResponse(data)

    if (error) {
      toast.error(options?.errorMessage ?? getErrorMessage(error))
    } else if (response?.success) {
      toast.success(options?.successMessage ?? response.message ?? 'สำเร็จ')
    } else if (response && response.success === false) {
      toast.error(options?.errorMessage ?? response.message ?? 'ไม่สำเร็จ', {
        description: response.error,
      })
    }

    const client = asQueryClient(context)
    if (client) {
      if (queryAction === 'invalidate') {
        client.invalidateQueries(options?.queryFilters)
      } else if (queryAction === 'refetch') {
        client.refetchQueries(options?.queryFilters)
      }
    }

    options?.onFinally?.()
  }
}

export function unwrapApiData<T>(
  response: ApiResponse<T>,
  fallbackMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น',
): T {
  if (response.success && response.data !== undefined) {
    return response.data
  }

  throw new Error(response.error || response.message || fallbackMessage)
}

export async function mutateApiData<TData, TVariables>(
  mutateAsync: MutateAsyncFn<TVariables>,
  variables: TVariables,
  options?: ApiMutationOptions,
): Promise<TData> {
  const { fallbackMessage, ...settledOptions } = options ?? {}

  const result = await mutateAsync(variables, {
    onSettled: createApiSettledHandler(settledOptions),
  })

  return unwrapApiData(result as ApiResponse<TData>, fallbackMessage)
}

export async function mutateApiSuccess<TVariables>(
  mutateAsync: MutateAsyncFn<TVariables>,
  variables: TVariables,
  options?: ApiMutationOptions,
): Promise<void> {
  const { fallbackMessage, ...settledOptions } = options ?? {}

  const result = await mutateAsync(variables, {
    onSettled: createApiSettledHandler(settledOptions),
  })

  if (!result.success) {
    throw new Error(
      result.error || result.message || fallbackMessage || 'Operation failed',
    )
  }
}
