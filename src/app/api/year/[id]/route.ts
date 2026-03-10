import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { authorized, ok, okOnlyMessage, unauthorized } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    // authorized
    const user = await authorized(request)
    if (!user) return unauthorized()
    //
    const { id } = await context.params
    const data = await yearUseCase.getById(id)
    return ok('ดึงข้อมูลปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    // authorized
    const user = await authorized(request)
    if (!user) return unauthorized()
    // 
    const { id } = await context.params
    const payload = await request.json()
    const data = await yearUseCase.update(id, payload)
    return ok('แก้ไขปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    // authorized
    const user = await authorized(request)
    if (!user) return unauthorized()
    //
    const { id } = await context.params
    await yearUseCase.delete(id)
    return okOnlyMessage('ลบปีการศึกษาสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
