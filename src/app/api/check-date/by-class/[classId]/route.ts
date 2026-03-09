import { CheckDateQuery } from '@/core/domain/data/check-date';
import { checkDateUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ classId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { classId } = await context.params
    const filter = getJsonSearchParam<CheckDateQuery>(request, 'filter')
    const data = await checkDateUseCase.getByClassId(classId, filter)
    return ok('ดึงรายการวันเช็กชื่อตามห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
