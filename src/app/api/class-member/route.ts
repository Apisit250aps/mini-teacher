import { classMemberUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function POST(request: NextAuthRequest) {
  try {
    const payload = await request.json()
    const data = await classMemberUseCase.create(payload)
    return ok('เพิ่มสมาชิกห้องเรียนสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(request: NextAuthRequest) {
  try {
    const payload = (await request.json()) as {
      classId?: string
      studentId?: string
    }
    await classMemberUseCase.delete(payload.classId, payload.studentId)
    return okOnlyMessage('ลบสมาชิกห้องเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
