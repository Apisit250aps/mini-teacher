import { scoreAssignUseCase } from '@/core/usecases'
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
    const data = await scoreAssignUseCase.update(id, payload)
    return ok('แก้ไขงานคะแนนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    await scoreAssignUseCase.delete(id)
    return okOnlyMessage('ลบงานคะแนนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
