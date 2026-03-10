import { classUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await classUseCase.create(payload)
    return ok('สร้างห้องเรียนสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
