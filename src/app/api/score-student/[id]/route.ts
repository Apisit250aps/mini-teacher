import { scoreStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await scoreStudentUseCase.update(id, payload)
    return ok('แก้ไขคะแนนนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    await scoreStudentUseCase.delete(id)
    return okOnlyMessage('ลบคะแนนนักเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
