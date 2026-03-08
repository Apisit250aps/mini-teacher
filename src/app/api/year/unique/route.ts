import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const userId = getSearchParam(request, 'userId')
    const year = getSearchParam(request, 'year')
    const term = getSearchParam(request, 'term')

    const data = await yearUseCase.getUnique(
      userId,
      year ? Number(year) : year,
      term ? Number(term) : term,
    )
    return ok('ดึงข้อมูลปีการศึกษาแบบ unique สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
