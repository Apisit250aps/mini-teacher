import { userUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { badRequest, getSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const email = getSearchParam(request, 'email')
    if (!email) {
      return badRequest('กรุณาระบุอีเมล')
    }
    const data = await userUseCase.getByEmail(email)
    return ok('ดึงข้อมูลผู้ใช้ด้วยอีเมลสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
