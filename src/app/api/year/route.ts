import { NextResponse } from 'next/server'
import { yearUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const data = await yearUseCase.create(payload)

    return NextResponse.json(
      {
        success: true,
        message: 'สร้างปีการศึกษาสำเร็จ',
        data,
      } satisfies ApiResponse<typeof data>,
      { status: 201 },
    )
  } catch (error) {
    return toErrorResponse(error)
  }
}
