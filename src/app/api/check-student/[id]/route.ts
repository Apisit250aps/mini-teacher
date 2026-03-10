import { checkStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok, okOnlyMessage } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const data = await checkStudentUseCase.getById(id)
    return ok('ดึงข้อมูลเช็กชื่อนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const data = await checkStudentUseCase.update(id, payload)
    return ok('แก้ไขข้อมูลเช็กชื่อนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    await checkStudentUseCase.delete(id)
    return okOnlyMessage('ลบข้อมูลเช็กชื่อนักเรียนสำเร็จ')
  } catch (error) {
    return toErrorResponse(error)
  }
}
