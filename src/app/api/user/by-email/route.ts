import { userUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const email = getSearchParam(request, 'email')
    const data = await userUseCase.getByEmail(email)
    return ok('ดึงข้อมูลผู้ใช้ด้วยอีเมลสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
