import { onErrorMessage, safeValidate } from '@/lib/utils'
import { CreateScoreAssignSchema, ScoreAssign } from '@/models/entities'
import {
  createScoreAssign,
  getScoreAssignsByClassId,
} from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  yearId: string
  classId: string
}

export async function CreateScoreAssign(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse<ApiResponse<ScoreAssign>>> {
  try {
    const { classId } = await params
    const body = await req.json()
    const validate = await safeValidate(CreateScoreAssignSchema, {
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
    const scoreAssign = await createScoreAssign(validate.data)
    return NextResponse.json(
      {
        success: true,
        data: scoreAssign,
        message: 'Score assign created successfully',
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

export async function GetScoreAssignsByClassId(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse<ApiResponse<ScoreAssign[]>>> {
  try {
    const { classId } = await params
    const scoreAssigns = await getScoreAssignsByClassId(classId)
    return NextResponse.json(
      {
        success: true,
        data: scoreAssigns,
        message: 'Score assigns retrieved successfully',
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
        message: 'Failed to retrieve score assigns',
      },
      {
        status: 500,
      },
    )
  }
}
