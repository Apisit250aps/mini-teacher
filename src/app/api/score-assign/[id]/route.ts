import { scoreAssignUseCase } from '@/core/usecases'
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
    const data = await scoreAssignUseCase.update(id, payload)
    return ok('แก้ไขงานคะแนนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    await scoreAssignUseCase.delete(id)
    return okOnlyMessage('ลบงานคะแนนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
