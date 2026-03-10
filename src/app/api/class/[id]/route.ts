import { classUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await classUseCase.getById(id)
    return ok('ดึงข้อมูลห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await classUseCase.update(id, payload)
    return ok('แก้ไขห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    await classUseCase.delete(id)
    return okOnlyMessage('ลบห้องเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
