import { auth } from '@/auth'
import { onErrorMessage, safeValidate } from '@/lib/utils'
import { CreateYearSchema, UpdateYearSchema, Year } from '@/models/entities'
import { createYear, getUniqYear, updateYear } from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type YearParams = {
  yearId: string
}

export async function CreateYear(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<Year>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await req.json()
    const validate = await safeValidate(CreateYearSchema, {
      ...body,
      user: session.user.id,
    })
    if (!validate.data) {
      return NextResponse.json(
        { success: false, message: 'Validation Error', errors: validate.error },
        { status: 400 },
      )
    }

    const existing = await getUniqYear(
      session.user.id,
      validate.data.year,
      validate.data.term,
    )

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Year with the same year and term already exists',
        },
        { status: 400 },
      )
    }

    const year = await createYear(validate.data)
    return NextResponse.json(
      { success: true, message: 'Year created successfully', data: year },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function UpdateYear(
  req: NextRequest,
  { params }: { params: Promise<YearParams> },
): Promise<NextResponse<ApiResponse<Year>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { yearId } = await params
    const body = await req.json()
    const validate = await safeValidate(UpdateYearSchema, body)
    if (!validate.data) {
      return NextResponse.json(
        { success: false, message: 'Validation Error', errors: validate.error },
        { status: 400 },
      )
    }

    const update = await updateYear(yearId, validate.data)
    if (!update) {
      return NextResponse.json(
        { success: false, message: 'Year not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { success: true, message: 'Year updated successfully', data: update },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
