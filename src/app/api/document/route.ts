import { documentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import {
  authorized,
  forbidden,
  getJsonSearchParam,
  getSearchParam,
  ok,
  unauthorized,
} from '@/lib/utils/server'
import type { NextRequest } from 'next/server'
import type { DocumentQuery } from '@/core/domain/data'
import type { DocumentType } from '@/core/domain/entities/enums'

export async function GET(request: NextRequest) {
  try {
    const latestType = getSearchParam(
      request,
      'latestType',
    ) as DocumentType | null
    if (latestType) {
      const data = await documentUseCase.getLatestByType(latestType)
      return ok('ดึงเอกสารล่าสุดสำเร็จ', data)
    }
    const filter = getJsonSearchParam<DocumentQuery>(request, 'filter')
    const data = await documentUseCase.getAll(filter)
    return ok('ดึงรายการเอกสารสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authorized(request)
    if (!user) return unauthorized()
    if (!user.isAdmin) return forbidden()

    const payload = await request.json()
    const data = await documentUseCase.create(payload)
    return ok('สร้างเอกสารสำเร็จ', data, 201)
  } catch (error) {
    return toErrorResponse(error)
  }
}
