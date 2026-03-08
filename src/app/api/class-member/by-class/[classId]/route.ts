import { classMemberUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ classId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { classId } = await context.params
    const filter = getJsonSearchParam(request, 'filter')
    const data = await classMemberUseCase.getByClassId(classId, filter)
    return ok('ดึงสมาชิกห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
