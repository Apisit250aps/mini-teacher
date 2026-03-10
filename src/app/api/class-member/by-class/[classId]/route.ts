import { ClassMemberQuery } from '@/core/domain/data/class-member';
import { classMemberUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { getJsonSearchParam, ok } from '@/lib/utils/server'
import type { NextRequest } from 'next/server'

type Context = {
  params: Promise<{ classId: string }>
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { classId } = await context.params
    const filter = getJsonSearchParam<ClassMemberQuery>(request, 'filter')
    const data = await classMemberUseCase.getByClassId(classId, filter)
    return ok('ดึงสมาชิกห้องเรียนสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
