import { scoreAssignUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ classId: string; assignId: string }>
}

export async function GET(_: NextAuthRequest, context: Context) {
  try {
    const { classId, assignId } = await context.params
    const data = await scoreAssignUseCase.getById(classId, assignId)
    return ok('ดึงข้อมูลงานคะแนนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
