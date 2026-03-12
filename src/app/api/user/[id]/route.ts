import { userUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import {
  authorized,
  forbidden,
  ok,
  okOnlyMessage,
  unauthorized,
} from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await userUseCase.getById(id)
    return ok('ดึงข้อมูลผู้ใช้สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()
    const { id } = await context.params
    if (!user.isAdmin && user.id !== id) return forbidden()
    const payload = await request.json()
    const data = await userUseCase.update(id, payload)
    return ok('แก้ไขผู้ใช้สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()
    const { id } = await context.params
    if (!user.isAdmin && user.id !== id) return forbidden()
    await userUseCase.delete(id)
    return okOnlyMessage('ลบผู้ใช้สำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
