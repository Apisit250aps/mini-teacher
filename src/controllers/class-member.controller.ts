import { auth } from '@/auth'
import { onErrorMessage, safeValidate } from '@/lib/utils'
import {
  ClassMember,
  ClassMemberSchema,
  CreateStudentSchema,
  createStudent,
  ClassMemberDetail,
  deleteClassMember,
  addClassMember,
  getClassMembersByClassId,
  getUniqMember,
} from '@/models'
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

export async function CreateAndAddClassMember(
  req: NextRequest,
  { params }: { params: Promise<ClassMemberParams> },
): Promise<NextResponse<ApiResponse<ClassMember>>> {
  try {
    const { classId } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to perform this action',
        },
        {
          status: 401,
        },
      )
    }

    const body = await req.json()

    const studentValidate = await safeValidate(CreateStudentSchema, {
      ...body,
      teacher: session.user.id,
    })

    if (!studentValidate.data) {
      return NextResponse.json(
        {
          success: false,
          error: studentValidate.error!,
          message: 'Invalid request data',
        },
        {
          status: 400,
        },
      )
    }

    const student = await createStudent(studentValidate.data)
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create student',
          message: 'Failed to create student',
        },
        {
          status: 500,
        },
      )
    }
    const memberValidate = await safeValidate(ClassMemberSchema, {
      classId,
      studentId: student.id,
    })
    if (!memberValidate.data) {
      return NextResponse.json(
        {
          success: false,
          error: memberValidate.error!,
          message: 'Invalid request data',
        },
        {
          status: 400,
        },
      )
    }
    const classMember = await addClassMember(memberValidate.data)
    return NextResponse.json(
      {
        success: true,
        data: classMember,
        message: 'Class member added successfully',
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

export async function GetMemberByClassId(
  req: NextRequest,
  { params }: { params: Promise<ClassMemberParams> },
): Promise<NextResponse<ApiResponse<ClassMemberDetail[]>>> {
  try {
    const { classId } = await params
    const members = await getClassMembersByClassId(classId)
    return NextResponse.json(
      {
        success: true,
        data: members,
        message: 'Class members retrieved successfully',
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
        message: 'Failed to retrieve class members',
      },
      {
        status: 500,
      },
    )
  }
}
