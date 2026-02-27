import { prisma } from '@/lib/prisma'
import { onErrorMessage } from '@/lib/utils'
import yearRepository from '@/repositories/year.repo'
import { Prisma } from '@prisma'
import { NextAuthRequest } from 'next-auth'
import { NextResponse } from 'next/server'

export default async function CreateYear(
  req: NextAuthRequest,
): Promise<NextResponse<ApiResponse<Prisma.YearModel>>> {
  try {
    const body = await req.json()
    const { year, term } = body
    const userId = req.auth?.user.id
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 },
      )
    }
    const user = await prisma.user.findFirst({ where: { id: userId } })
    const newYear = await yearRepository.create({
      year,
      term,
      owner: {
        connect: {
          id: user?.id,
        },
      },
    })
    return NextResponse.json({
      success: true,
      message: 'Year created successfully',
      data: newYear,
    })
  } catch (error) {
    console.error('Error creating year:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create year',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
