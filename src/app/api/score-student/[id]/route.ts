import { scoreStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await scoreStudentUseCase.update(id, payload)
    return ok('แก้ไขคะแนนนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    await scoreStudentUseCase.delete(id)
    return okOnlyMessage('ลบคะแนนนักเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
