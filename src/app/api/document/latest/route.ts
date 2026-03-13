import { documentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'
import type {
  DocumentType,
  DocumentLanguage,
} from '@/core/domain/entities/enums'

export async function GET(request: NextRequest) {
  try {
    const latestType = getSearchParam(
      request,
      'latestType',
    ) as DocumentType | null
    const lang = getSearchParam(request, 'lang') as DocumentLanguage | null
    const data = await documentUseCase.getLatestByType(
      latestType!,
      lang ?? 'TH',
    )
    return ok('ดึงเอกสารล่าสุดสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
