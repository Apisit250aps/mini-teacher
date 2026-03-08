import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const filter = getJsonSearchParam(request, 'filter')
    const data = await yearUseCase.getAll(filter)
    return ok('ดึงรายการปีการศึกษาสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextAuthRequest) {
  try {
    const payload = await request.json()
    const data = await yearUseCase.create(payload)

    return ok('สร้างปีการศึกษาสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
