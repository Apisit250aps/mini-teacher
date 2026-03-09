import { studentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { authorized, ok, unauthorized } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

export async function POST(request: NextAuthRequest) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()

    const payload = await request.json()
    const data = await studentUseCase.create(
      { ...payload, teacherId: user.id }
    )
    return ok('สร้างนักเรียนสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
