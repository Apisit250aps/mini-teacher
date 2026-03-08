import { checkDateUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function POST(request: NextAuthRequest) {
  try {
    const payload = await request.json()
    const data = await checkDateUseCase.create(payload)
    return ok('สร้างวันเช็กชื่อสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
