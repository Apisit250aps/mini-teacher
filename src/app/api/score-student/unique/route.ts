import { scoreStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const assignmentId = getSearchParam(request, 'assignmentId')
    const studentId = getSearchParam(request, 'studentId')
    const data = await scoreStudentUseCase.getUnique(assignmentId!, studentId!)
    return ok('ดึงคะแนนแบบ unique สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
