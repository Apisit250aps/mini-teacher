import { onErrorMessage, safeValidate } from '@/lib/utils'
import { Class, CreateClassSchema } from '@/models/entities'
import { createClass } from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type ClassParams = {
  yearId: string
}

export async function CreateClass(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
): Promise<NextResponse<ApiResponse<Class>>> {
  try {
    const { yearId } = await params
    const body = await req.json()

    const validate = await safeValidate(CreateClassSchema, {
      ...body,
      year: yearId,
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

