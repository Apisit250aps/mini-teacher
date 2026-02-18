import { toast } from 'sonner'

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
