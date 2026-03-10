import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import {
  authorized,
  getJsonSearchParam,
  ok,
  unauthorized,
} from '@/lib/utils/server'
import type { NextRequest } from 'next/server'
import { YearQuery } from '@/core/domain/data'

export async function GET(request: NextRequest) {
  try {
    const filter = getJsonSearchParam<YearQuery>(request, 'filter')
    const data = await yearUseCase.getAll(filter)
    return ok('ดึงรายการปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authorized(request)

    if (!user) return unauthorized()

    const payload = await request.json()
    const data = await yearUseCase.create(payload)

    return ok('สร้างปีการศึกษาสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
