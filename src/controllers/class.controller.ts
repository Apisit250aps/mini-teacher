import { onErrorMessage, safeValidate } from '@/lib/utils'
import type { Class } from '@/models/domain'
import { CreateClassSchema, UpdateClassSchema } from '@/models/entities'
import {
  createClass,
  updateClass,
  deleteClass,
  getClassesByYear,
  getClassById,
} from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type ClassParams = {
  classId: string
}

export async function CreateClass(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Class>>> {
  try {
    const body = await req.json()
    const validate = await safeValidate(CreateClassSchema, {
      ...body,
    })

    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation Error!',
          error: validate.error!,
        },
        { status: 400 },
      )
    }

    const createdClass = await createClass(validate.data)

    return NextResponse.json(
      {
        success: true,
        message: 'Class created successfully!',
        data: createdClass,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error!',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function UpdateClass(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
): Promise<NextResponse<ApiResponse<Class>>> {
  try {
    const { classId } = await params
    const body = await req.json()
    const validate = await safeValidate(UpdateClassSchema, body)
    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation Error!',
          error: validate.error!,
        },
        { status: 400 },
      )
    }

    const updatedClass = await updateClass(classId, validate.data)
    if (!updatedClass) {
      return NextResponse.json(
        {
          success: false,
          message: 'Class not found!',
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Class updated successfully!',
        data: updatedClass,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error!',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function DeleteClass(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { classId } = await params
    await deleteClass(classId)
    return NextResponse.json(
      {
        success: true,
        message: 'Class deleted successfully!',
        data: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error!',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function GetClassYear(
  req: NextRequest,
  context?: { params?: Promise<{ yearId?: string }> },
): Promise<NextResponse<ApiResponse<Class[]>>> {
  try {
    const pathYearId = (await context?.params)?.yearId
    const queryYearId = req.nextUrl.searchParams.get('yearId')
    const yearId = pathYearId ?? queryYearId
    if (!yearId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation Error!',
          error: 'yearId query parameter is required',
        },
        { status: 400 },
      )
    }
    const classes = await getClassesByYear(yearId)
    return NextResponse.json(
      {
        success: true,
        message: 'Classes retrieved successfully!',
        data: classes,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error!',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function GetClassById(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
): Promise<NextResponse<ApiResponse<Class>>> {
  try {
    const { classId } = await params
    const foundClass = await getClassById(classId)
    if (!foundClass) {
      return NextResponse.json(
        {
          success: false,
          message: 'Class not found!',
        },
        { status: 404 },
      )
    }
    return NextResponse.json(
      {
        success: true,
        message: 'Class retrieved successfully!',
        data: foundClass,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error!',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
