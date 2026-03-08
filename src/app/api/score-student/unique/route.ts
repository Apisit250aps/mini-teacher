import { scoreStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const assignmentId = getSearchParam(request, 'assignmentId')
    const studentId = getSearchParam(request, 'studentId')
    const data = await scoreStudentUseCase.getUnique(assignmentId, studentId)
    return ok('ดึงคะแนนแบบ unique สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
