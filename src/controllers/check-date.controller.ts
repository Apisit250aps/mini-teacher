import { onErrorMessage, safeValidate } from '@/lib/utils'
import { CheckDate, CreateCheckDateSchema } from '@/models/entities'
import { createCheckDate } from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

export async function CreateCheckDate(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<CheckDate>>> {
  try {
    const body = await req.json()
    const validate = await safeValidate(CreateCheckDateSchema, body)
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
    return NextResponse.json({
      success: true,
      message: 'Check date created successfully',
      data: check,
    }, {
      status: 201,
    })
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
