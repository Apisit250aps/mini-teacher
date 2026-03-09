import { ClassQuery } from '@/core/domain/data/class';
import { classUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ yearId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { yearId } = await context.params
    const filter = getJsonSearchParam<ClassQuery>(request, 'filter')
    const data = await classUseCase.getByYearId(yearId, filter)
    return ok('ดึงรายการห้องเรียนตามปีสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
