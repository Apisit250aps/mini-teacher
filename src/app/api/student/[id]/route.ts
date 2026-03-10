import { studentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await studentUseCase.getById(id)
    return ok('ดึงข้อมูลนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await studentUseCase.update(id, payload)
    return ok('แก้ไขนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    await studentUseCase.delete(id)
    return okOnlyMessage('ลบนักเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
