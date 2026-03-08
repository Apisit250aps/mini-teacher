import { checkStudentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getSearchParam, ok } from '@/app/api/_utils'
import type { NextAuthRequest } from 'next-auth'

export async function GET(request: NextAuthRequest) {
  try {
    const checkDateId = getSearchParam(request, 'checkDateId')
    const studentId = getSearchParam(request, 'studentId')
    const data = await checkStudentUseCase.getUnique(checkDateId, studentId)
    return ok('ดึงข้อมูลเช็กชื่อแบบ unique สำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
