import { auth } from '@/auth'
import { onErrorMessage, safeValidate } from '@/lib/utils'
import type { Year } from '@/models/domain'
import { CreateYearSchema, UpdateYearSchema } from '@/models/entities'
import yearRepository from '@/models/repositories/year.repo'
import { NextRequest, NextResponse } from 'next/server'

type YearParams = {
  yearId: string
}

export async function AuthCreateYear(
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

    const existing = await yearRepository.getUniqYear(
      session.user.id,
      validate.data.year,
      validate.data.term,
    )

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Year with the same year and term already exists',
          error: 'Duplicate year and term',
        },
        { status: 400 },
      )
    }

    const year = await yearRepository.authCreateYear(validate.data)
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

export async function AuthUpdateYear(
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

    const update = await yearRepository.authUpdateYear(yearId, session.user.id, validate.data)
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

export async function AuthGetYearById(
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
    const year = await yearRepository.authGetYearById(yearId, session.user.id)
    if (!year) {
      return NextResponse.json(
        { success: false, message: 'Year not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { success: true, message: 'Year fetched successfully', data: year },
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

export async function AuthGetAllYears(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Year[]>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }
    const years = await yearRepository.authGetAllYears(session.user.id)
    return NextResponse.json(
      { success: true, message: 'Years fetched successfully', data: years },
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

export async function AuthDeleteYear(
  req: NextRequest,
  { params }: { params: Promise<YearParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }
    const { yearId } = await params
    const year = await yearRepository.authGetYearById(yearId, session.user.id)
    if (!year) {
      return NextResponse.json(
        { success: false, message: 'Year not found' },
        { status: 404 },
      )
    }

    await yearRepository.authDeleteYear(yearId, session.user.id)
    return NextResponse.json(
      { success: true, message: 'Year deleted successfully', data: null },
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

export async function AuthSetActiveYear(
  req: NextRequest,
  { params }: { params: Promise<YearParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }
    const { yearId } = await params
    const year = await yearRepository.authGetYearById(yearId, session.user.id)
    if (!year) {
      return NextResponse.json(
        { success: false, message: 'Year not found' },
        { status: 404 },
      )
    }
    await yearRepository.authSetActiveYear(session.user.id, yearId)
    return NextResponse.json(
      { success: true, message: 'Active year set successfully', data: null },
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
