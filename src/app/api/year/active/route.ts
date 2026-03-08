import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok, okOnlyMessage } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const userId = getSearchParam(request, 'userId')
    const data = await yearUseCase.getActiveByUser(userId)
    return ok('ดึงปีการศึกษาที่ใช้งานสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextAuthRequest) {
  try {
    const payload = (await request.json()) as {
      userId?: string
      yearId?: string
    }
    await yearUseCase.setActive(payload.userId, payload.yearId)
    return okOnlyMessage('เปลี่ยนปีการศึกษาที่ใช้งานสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
