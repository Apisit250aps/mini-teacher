import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import {
  badRequest,
  getSearchParam,
  ok,
  okOnlyMessage,
} from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = getSearchParam(request, 'userId')
    if (!userId) {
      return badRequest('กรุณาระบุ userId')
    }
    const data = await yearUseCase.getActiveByUser(userId)
    return ok('ดึงปีการศึกษาที่ใช้งานสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      userId: string
      yearId: string
    }
    await yearUseCase.setActive(payload.userId, payload.yearId)
    return okOnlyMessage('เปลี่ยนปีการศึกษาที่ใช้งานสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
