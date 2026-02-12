import client from '@/lib/client'
import { onErrorMessage } from '@/lib/utils'
import { Year } from '@/models/entities'

export async function AuthCreateYearService({ data }: { data: Partial<Year> }) {
  try {
    const result = await client.post<ApiResponse<Year>>('/api/year', data)
    if (!result.data.success) {
      throw new Error(result.data.message)
    }
    return result.data.data
  } catch (error) {
    throw onErrorMessage(error)
  }
}

export async function AuthGetAllYearsService() {
  try {
    const result = await client.get<ApiResponse<Year[]>>('/api/year')
    if (!result.data.success) {
      throw new Error(result.data.message)
    }
    return result.data.data
  } catch (error) {
    throw onErrorMessage(error)
  }
}

export async function AuthGetYearByIdService({ yearId }: { yearId: string }) {
  try {
    const result = await client.get<ApiResponse<Year>>(`/api/year/${yearId}`)
    if (!result.data.success) {
      throw new Error(result.data.message)
    }
    return result.data.data
  } catch (error) {
    throw onErrorMessage(error)
  }
}

export async function AuthUpdateYearService({
  yearId,
  data,
}: {
  yearId: string
  data: Partial<Year>
}) {
  try {
    const result = await client.put<ApiResponse<Year>>(
      `/api/year/${yearId}`,
      data,
    )
    if (!result.data.success) {
      throw new Error(result.data.message)
    }
    return result.data.data
  } catch (error) {
    throw onErrorMessage(error)
  }
}

export async function AuthDeleteYearService({ yearId }: { yearId: string }) {
  try {
    const result = await client.delete<ApiResponse<null>>(`/api/year/${yearId}`)
    if (!result.data.success) {
      throw new Error(result.data.message)
    }
    return result.data.data
  } catch (error) {
    throw onErrorMessage(error)
  }
}
