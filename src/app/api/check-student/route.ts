import { checkStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

export async function POST(request: NextAuthRequest) {
  try {
    const payload = await request.json()
    const data = await checkStudentUseCase.create(payload)
    return ok('สร้างข้อมูลเช็กชื่อนักเรียนสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
