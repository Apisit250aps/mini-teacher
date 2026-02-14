import { onErrorMessage, safeValidate } from '@/lib/utils'
import { ClassMember, ClassMemberSchema } from '@/models/entities'
import {
  addClassMember,
  deleteClassMember,
  getUniqMember,
} from '@/models/repositories/class-member.repo'
import { NextRequest, NextResponse } from 'next/server'

type ClassMemberParams = {
  classId: string
}

export async function PatchClassMember(
  req: NextRequest,
  { params }: { params: Promise<ClassMemberParams> },
): Promise<NextResponse<ApiResponse<ClassMember | null>>> {
  try {
    const { classId } = await params
    const body = await req.json()
    const validate = await safeValidate(ClassMemberSchema, {
      ...body,
      classId,
    })
    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          error: validate.error!,
          message: 'Invalid request data',
        },
        {
          status: 400,
        },
      )
    }
    const uniqMember = await getUniqMember(
      validate.data.classId,
      validate.data.studentId,
    )
    let message = ''
    if (uniqMember) {
      await deleteClassMember(validate.data.classId, validate.data.studentId)
      message = 'Class member removed successfully'
    } else {
      await addClassMember(validate.data)
      message = 'Class member added successfully'
    }
    return NextResponse.json(
      {
        success: true,
        message,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to process request',
      },
      {
        status: 500,
      },
    )
  }
}
