import { CheckStudentQuery } from '@/core/domain/data/check-student';
import { checkStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ checkDateId: string }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { checkDateId } = await context.params
    const filter = getJsonSearchParam<CheckStudentQuery>(request, 'filter')
    const data = await checkStudentUseCase.getByCheckDateId(checkDateId, filter)
    return ok('ดึงรายการเช็กชื่อตามวันสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
