import { documentUseCase } from '@/core/usecases'
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

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await documentUseCase.getById(id)
    return ok('ดึงข้อมูลเอกสารสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()
    if (!user.isAdmin) return forbidden()

    const { id } = await context.params
    const payload = await request.json()
    const data = await documentUseCase.update(id, payload)
    return ok('แก้ไขเอกสารสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()
    if (!user.isAdmin) return forbidden()

    const { id } = await context.params
    await documentUseCase.delete(id)
    return okOnlyMessage('ลบเอกสารสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
