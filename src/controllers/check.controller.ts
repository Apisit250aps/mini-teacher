
import { onErrorMessage, safeValidate } from '@/lib/utils';
import {
  CheckDate,
  CheckStudent,
  CreateCheckDateSchema,
  CreateCheckStudentSchema,
} from '@/models/entities'
import {
  createCheckDate,
  createCheckStudent,
  getCheckDatesByClassId,
  getUniqueCheckStudent,
  updateCheckStudent,
} from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  yearId: string
  classId: string
  checkDateId: string
}

export async function CreateCheckDate(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse<ApiResponse<CheckDate>>> {
  try {
    const { classId } = await params
    const body = await req.json()
    const validate = await safeValidate(CreateCheckDateSchema, {
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
    const check = await createCheckDate(validate.data)
    return NextResponse.json(
      {
        success: true,
        message: 'Check date created successfully',
        data: check,
      },
      {
        status: 201,
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

export async function GetCheckDates(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse<ApiResponse<CheckDate[]>>> {
  try {
    const { classId } = await params
    const checks = await getCheckDatesByClassId(classId)
    return NextResponse.json(
      {
        success: true,
        message: 'Check dates retrieved successfully',
        data: checks,
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
        message: 'Failed to retrieve check dates',
      },
      {
        status: 500,
      },
    )
  }
}

export async function CreateCheckStudent(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse<ApiResponse<CheckStudent>>> {
  try {
    const { checkDateId } = await params
    const body = await req.json()
    const validate = await safeValidate(CreateCheckStudentSchema, {
      ...body,
      checkDateId,
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
    const existing = await getUniqueCheckStudent(
      validate.data.checkDateId,
      validate.data.studentId,
    )
    let check: CheckStudent
    if (existing) {
      check = await updateCheckStudent(existing.id, validate.data)
    } else {
      check = await createCheckStudent(validate.data)
    }

    return NextResponse.json(
      {
        success: true,
        message: existing
          ? 'Check student updated successfully'
          : 'Check student created successfully',
        data: check,
      },
      {
        status: existing ? 200 : 201,
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

