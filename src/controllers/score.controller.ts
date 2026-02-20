import { onErrorMessage, safeValidate } from '@/lib/utils'
import {
  CreateScoreAssignSchema,
  CreateScoreStudentSchema,
  ScoreAssign,
  ScoreStudent,
} from '@/models'

import {
  createScoreAssign,
  createScoreStudent,
  getScoreAssignsByClassId,
  getUniqueScoreStudent,
  updateScoreStudent,
} from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type ClassParams = {
  classId: string
}

type ScoreAssignParams = {
  classId: string
  scoreAssignId: string
}

export async function CreateScoreAssign(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
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
  { params }: { params: Promise<ClassParams> },
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

export async function PatchScoreStudent(
  req: NextRequest,
  { params }: { params: Promise<ScoreAssignParams> },
): Promise<NextResponse<ApiResponse<ScoreStudent>>> {
  try {
    const { scoreAssignId } = await params
    const body = await req.json()
    const validate = await safeValidate(CreateScoreStudentSchema, {
      ...body,
      scoreAssignId,
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
    let result: ScoreStudent
    let message: string
    let status: number
    const uniq = await getUniqueScoreStudent(
      validate.data.scoreAssignId,
      validate.data.studentId,
    )
    if (uniq) {
      result = await updateScoreStudent(uniq.id, validate.data.score)
      message = 'Score student updated successfully'
      status = 200
    } else {
      result = await createScoreStudent(validate.data)
      message = 'Score student created successfully'
      status = 201
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message,
      },
      {
        status,
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: onErrorMessage(error),
        message: 'Failed to create score student',
      },
      {
        status: 500,
      },
    )
  }
}
