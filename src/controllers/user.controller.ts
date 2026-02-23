import { onErrorMessage, safeValidate } from '@/lib/utils'
import { CreateUserSchema, UpdateUserSchema } from '@/models/entities'
import userRepository from '@/models/repositories/user.repo'
import { User } from 'next-auth'
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
          message: 'ตรวจสอบข้อมูลไม่ถูกต้อง',
          error: validate.error!,
        },
        { status: 400 },
      )
    }
    const uniq = await userRepository.findUserByName(validate.data.name)
    if (uniq) {
      return NextResponse.json(
        {
          success: false,
          message: 'ชื่อผู้ใช้ซ้ำ',
          error: 'ชื่อผู้ใช้ซ้ำ',
        },
        { status: 409 },
      )
    }
    const insert = await userRepository.createUser(validate.data)
    if (!insert) {
      throw new Error('การสร้างผู้ใช้ล้มเหลว')
    }
    return NextResponse.json(
      {
        success: true,
        message: 'สร้างผู้ใช้สำเร็จ',
        data: insert,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}

export async function UpdateUser(
  req: NextRequest,
  { params }: { params: Promise<UserParams> },
): Promise<NextResponse<ApiResponse<User | null>>> {
  try {
    const { userId } = await params
    const body = await req.json()
    const validate = await safeValidate(UpdateUserSchema, body)
    if (!validate.data) {
      return NextResponse.json(
        {
          success: false,
          message: 'ตรวจสอบข้อมูลไม่ถูกต้อง',
          error: validate.error!,
        },
        { status: 400 },
      )
    }
    const user = await userRepository.findUserById(userId)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบผู้ใช้',
          error: 'ไม่พบผู้ใช้',
        },
        { status: 404 },
      )
    }
    const update = await userRepository.updateUser(userId, validate.data)
    if (!update) {
      throw new Error('การอัปเดตผู้ใช้ล้มเหลว')
    }
    return NextResponse.json(
      {
        success: true,
        message: 'อัปเดตผู้ใช้สำเร็จ',
        data: update,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์',
        error: onErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
