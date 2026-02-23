import { auth } from '@/auth'
import { onErrorMessage, safeValidate } from '@/lib/utils'
import type { Student } from '@/models/domain'
import { CreateStudentSchema, UpdateStudentSchema } from '@/models/entities'
import studentRepository from '@/models/repositories/student.repo'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

type StudentParams = {
  studentId: string
}

export async function CreateStudent(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Student>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }
    const body = await req.json()
    const validate = await safeValidate(CreateStudentSchema, {
      ...body,
      teacher: session.user.id,
    })

    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          error: validate.error!,
          message: 'Invalid request body',
        },
        { status: 400 },
      )
    }

    const student = await studentRepository.teacherCreateStudent(validate.data)

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: 'Student created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to create student',
      },
      { status: 500 },
    )
  }
}

export async function GetStudentById(
  req: NextRequest,
  { params }: { params: Promise<StudentParams> },
): Promise<NextResponse<ApiResponse<Student>>> {
  try {
    const { studentId } = await params
    const student = await studentRepository.getStudentById(studentId)
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: 'Student retrieved successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to retrieve student',
      },
      { status: 500 },
    )
  }
}

export async function UpdateStudent(
  req: NextRequest,
  { params }: { params: Promise<StudentParams> },
): Promise<NextResponse<ApiResponse<Student>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }
    const { studentId } = await params
    const body = await req.json()
    const validate = await safeValidate(UpdateStudentSchema, {
      ...body,
      teacher: session.user.id,
    })

    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          error: validate.error!,
          message: 'Invalid request body',
        },
        { status: 400 },
      )
    }

    const student = await studentRepository.teacherUpdateStudent(studentId, validate.data)
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: 'Student updated successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to update student',
      },
      { status: 500 },
    )
  }
}

export async function DeleteStudent(
  req: NextRequest,
  { params }: { params: Promise<StudentParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }
    const { studentId } = await params
    const student = await studentRepository.getStudentById(studentId)
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found',
        },
        { status: 404 },
      )
    }

    await studentRepository.teacherDeleteStudent(studentId, session.user.id)
    return NextResponse.json(
      {
        success: true,
        data: null,
        message: 'Student deleted successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to delete student',
      },
      { status: 500 },
    )
  }
}

export async function GetAllStudent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextRequest,
): Promise<NextResponse<ApiResponse<Student[]>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }
    const students = await studentRepository.teacherGetAllStudent(session.user.id)
    return NextResponse.json(
      {
        success: true,
        data: students,
        message: 'Students retrieved successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to retrieve students',
      },
      { status: 500 },
    )
  }
}
