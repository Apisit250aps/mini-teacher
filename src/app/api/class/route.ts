import { classUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function POST(request: NextAuthRequest) {
  try {
    const payload = await request.json()
    const data = await classUseCase.create(payload)
    return ok('สร้างห้องเรียนสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
