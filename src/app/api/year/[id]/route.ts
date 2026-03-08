import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await yearUseCase.getById(id)
    return ok('ดึงข้อมูลปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await yearUseCase.update(id, payload)
    return ok('แก้ไขปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    await yearUseCase.delete(id)
    return okOnlyMessage('ลบปีการศึกษาสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
