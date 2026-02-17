import { toast } from 'sonner'

export function selectArray<T>(res: ApiResponse<T>) {
  if (!res) return []
  if (!res.success) {
    toast.error(res.message, {
      description: res.error,
    })
    return []
  }
  return res.data
}
