import { ScoreAssignQuery } from '@/core/domain/data';
import { scoreAssignUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ classId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { classId } = await context.params
    const filter = getJsonSearchParam<ScoreAssignQuery>(request, 'filter')
    const data = await scoreAssignUseCase.getByClassId(classId, filter)
    return ok('ดึงรายการงานคะแนนตามห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
