import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string; scoreAssignId: string }> },
): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      data: await getScoreAssignById((await params).scoreAssignId),
      message: 'Score assign retrieved successfully',
    },
    {
      status: 200,
    },
  )
}

function getScoreAssignById(scoreAssignId: string): unknown {
  throw new Error('Function not implemented.')
}
