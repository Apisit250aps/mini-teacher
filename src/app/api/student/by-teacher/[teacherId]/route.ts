import { StudentQuery } from '@/core/domain/data/student';
import { studentUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextAuthRequest } from 'next-auth'

type Context = {
  params: Promise<{ teacherId: string }>
}

export async function GET(request: NextAuthRequest, context: Context) {
  try {
    const { teacherId } = await context.params
    const filter = getJsonSearchParam<StudentQuery>(request, 'filter')
    const data = await studentUseCase.getAllByTeacher(teacherId, filter)
    return ok('ดึงรายการนักเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
