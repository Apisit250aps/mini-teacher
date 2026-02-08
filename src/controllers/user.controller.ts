import { safeValidate } from '@/lib/utils'
import { CreateUserSchema, type User } from '@/models/entities'
import { createUser, findUserByName } from '@/models/repositories'
import { NextRequest, NextResponse } from 'next/server'

type UserParams = {
  userId: string
}

export async function CreateUser(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<User | null>>> {
  try {
    const body = await req.json()
    const validate = await safeValidate(CreateUserSchema, body)
    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: validate.error!,
        },
        { status: 400 },
      )
    }
    const uniq = await findUserByName(validate.data.name)
    if (uniq) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username already exists',
          error: 'Username already exists',
        },
        { status: 400 },
      )
    }
    const insert = await createUser(validate.data)
    if (!insert) {
      throw new Error('User creation failed')
    }
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: insert,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create user',
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
