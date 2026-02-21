import { onErrorMessage, safeValidate } from '@/lib/utils'
import type { CheckDate, CheckStudent } from '@/models'
import {
  CreateCheckDateSchema,
  CreateCheckStudentSchema,
  createCheckDate,
  createCheckStudent,
  deleteCheckDate,
  getCheckDateById,
  getCheckDatesByClassId,
  getUniqueCheckStudent,
  updateCheckDate,
  updateCheckStudent,
} from '@/models'
import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'

type ClassParams = {
  classId: string
}

type CheckDateParams = {
  classId: string
  checkDateId: string
}

const UpdateCheckDateBodySchema = z.object({
  date: z.string().optional(),
  isEditable: z.boolean().optional(),
})

export async function CreateCheckDate(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
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
  { params }: { params: Promise<ClassParams> },
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
  { params }: { params: Promise<CheckDateParams> },
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

export async function UpdateCheckDate(
  req: NextRequest,
  { params }: { params: Promise<CheckDateParams> },
): Promise<NextResponse<ApiResponse<CheckDate>>> {
  try {
    const { classId, checkDateId } = await params
    const checkDate = await getCheckDateById(checkDateId)
    if (!checkDate || checkDate.classId !== classId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Check date not found',
        },
        {
          status: 404,
        },
      )
    }

    const body = await req.json()
    const validate = await safeValidate(UpdateCheckDateBodySchema, body)
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

    if (!validate.data.date && validate.data.isEditable === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'No fields to update',
        },
        {
          status: 400,
        },
      )
    }

    const updated = await updateCheckDate(checkDateId, {
      ...validate.data,
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Check date updated successfully',
        data: updated,
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

export async function DeleteCheckDate(
  _req: NextRequest,
  { params }: { params: Promise<CheckDateParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { classId, checkDateId } = await params
    const checkDate = await getCheckDateById(checkDateId)
    if (!checkDate || checkDate.classId !== classId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Check date not found',
        },
        {
          status: 404,
        },
      )
    }

    await deleteCheckDate(checkDateId)

    return NextResponse.json(
      {
        success: true,
        message: 'Check date deleted successfully',
        data: null,
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
