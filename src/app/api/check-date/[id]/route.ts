import { checkDateUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await checkDateUseCase.getById(id)
    return ok('ดึงข้อมูลวันเช็กชื่อสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await checkDateUseCase.update(id, payload)
    return ok('แก้ไขวันเช็กชื่อสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextAuthRequest, context: Context) {
  try {
    const { id } = await context.params
    await checkDateUseCase.delete(id)
    return okOnlyMessage('ลบวันเช็กชื่อสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
