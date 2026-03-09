import { classUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ yearId: string; classId: string }>
}

export async function GET(_: NextAuthRequest, context: Context) {
  try {
    const { yearId, classId } = await context.params
    const data = await classUseCase.getByYearAndClassId(yearId, classId)
    return ok('ดึงข้อมูลห้องเรียนตามปีและรหัสสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
