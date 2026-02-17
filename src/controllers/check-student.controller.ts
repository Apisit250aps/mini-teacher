import { onErrorMessage, safeValidate } from '@/lib/utils'
import { CheckStudent, CreateCheckStudentSchema } from '@/models/entities'
import { createCheckStudent } from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

export async function CreateCheckStudent(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<CheckStudent>>> {
  try {
    const body = await req.json()
    const validate = await safeValidate(CreateCheckStudentSchema, body)
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
    const check = await createCheckStudent(validate.data)
    return NextResponse.json(
      {
        success: true,
        message: 'Check student created successfully',
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
