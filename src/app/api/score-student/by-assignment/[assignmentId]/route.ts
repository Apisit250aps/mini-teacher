import { scoreStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ assignmentId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { assignmentId } = await context.params
    const filter = getJsonSearchParam(request, 'filter')
    const data = await scoreStudentUseCase.getByAssignmentId(
      assignmentId,
      filter,
    )
    return ok('ดึงรายการคะแนนตามงานสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
