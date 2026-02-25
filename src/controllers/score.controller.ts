import { onErrorMessage, safeValidate } from '@/lib/utils'
import type { ScoreAssign, ScoreStudent } from '@/models/domain'
import {
  CreateScoreAssignSchema,
  CreateScoreStudentSchema,
} from '@/models/entities'
import scoreAssignRepository from '@/models/repositories/mongo/score-assign.repo'
import scoreStudentRepository from '@/models/repositories/mongo/score-student.repo'
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
    const scoreAssign = await scoreAssignRepository.createScoreAssign(validate.data)
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

export async function UpdateScoreAssign(
  req: NextRequest,
  { params }: { params: Promise<ScoreAssignParams> },
): Promise<NextResponse<ApiResponse<ScoreAssign>>> {
  try {
    const { scoreAssignId } = await params
    const body = await req.json()
    const validate = await safeValidate(CreateScoreAssignSchema, {
      ...body,
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
    const scoreAssign = await scoreAssignRepository.updateScoreAssign(scoreAssignId, validate.data)
    if (!scoreAssign) {
      return NextResponse.json(
        {
          success: false,
          message: 'Score assign not found',
        },
        {
          status: 404,
        },
      )
    }
    return NextResponse.json(
      {
        success: true,
        data: scoreAssign,
        message: 'Score assign updated successfully',
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

export async function DeleteScoreAssign(
  req: NextRequest,
  { params }: { params: Promise<ScoreAssignParams> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { scoreAssignId } = await params
    await scoreAssignRepository.deleteScoreAssign(scoreAssignId)
    return NextResponse.json(
      {
        success: true,
        message: 'Score assign deleted successfully',
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

export async function GetScoreAssignsByClassId(
  req: NextRequest,
  { params }: { params: Promise<ClassParams> },
): Promise<NextResponse<ApiResponse<ScoreAssign[]>>> {
  try {
    const { classId } = await params
    const scoreAssigns = await scoreAssignRepository.getScoreAssignsByClassId(classId)
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
    const existing = await scoreStudentRepository.getUniqueScoreStudent(
      validate.data.scoreAssignId,
      validate.data.studentId,
    )
    if (existing) {
      result = await scoreStudentRepository.updateScoreStudent(existing.id, validate.data.score)
      message = 'Score student updated successfully'
      status = 200
    } else {
      result = await scoreStudentRepository.createScoreStudent(validate.data)
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

export async function GetScoreAssignById(
  _req: NextRequest,
  { params }: { params: Promise<ScoreAssignParams> },
): Promise<NextResponse<ApiResponse<ScoreAssign>>> {
  try {
    const { classId, scoreAssignId } = await params
    const scoreAssign = await scoreAssignRepository.getScoreAssignById(classId, scoreAssignId)

    if (!scoreAssign) {
      return NextResponse.json(
        {
          success: false,
          message: 'Score assign not found',
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: scoreAssign,
        message: 'Score assign retrieved successfully',
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
        message: 'Failed to retrieve score assign',
      },
      {
        status: 500,
      },
    )
  }
}
