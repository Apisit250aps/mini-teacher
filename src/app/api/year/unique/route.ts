import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { authorized, badRequest, getSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await authorized(request)

    const year = Number(getSearchParam(request, 'year'))
    const term = Number(getSearchParam(request, 'term'))
    const uid = getSearchParam(request, 'userId')

    const userId = uid || user?.id

    if (!userId) {
      return badRequest('กรุณาระบุ userId')
    }

    const data = await yearUseCase.getUnique(userId, year, term)
    return ok('ดึงข้อมูลปีการศึกษาแบบ unique สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
