import { checkStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ checkDateId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { checkDateId } = await context.params
    const filter = getJsonSearchParam(request, 'filter')
    const data = await checkStudentUseCase.getByCheckDateId(checkDateId, filter)
    return ok('ดึงรายการเช็กชื่อตามวันสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
