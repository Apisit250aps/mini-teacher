import { auth } from '@/auth'
import { NextAuthRequest, User } from 'next-auth'
import { NextResponse } from 'next/server'

export const authorized = async (_: NextAuthRequest): Promise<User | null> => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  console.log('Authorized user:', session)
  return session.user
}

export const ok = <T>(message: string, data: T, status = 200) =>
  NextResponse.json(
    {
      success: true,
      message,
      data,
    } satisfies ApiResponse<T>,
    { status },
  )

export const okOnlyMessage = (message: string, status = 200) =>
  NextResponse.json(
    {
      success: true,
      message,
    } satisfies ApiResponse,
    { status },
  )

export const badRequest = (message: string) =>
  NextResponse.json(
    {
      success: false,
      message,
    } satisfies ApiResponse<null>,
    { status: 400 },
  )

export const unauthorized = () =>
  NextResponse.json(
    {
      success: false,
      message: 'Unauthorized',
    } satisfies ApiResponse<null>,
    { status: 401 },
  )

export const getJsonSearchParam = <T>(
  request: Request,
  key: string,
): T | undefined => {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get(key)
  if (!raw) {
    return undefined
  }

  return JSON.parse(raw) as T
}

export const getSearchParam = (
  request: Request,
  key: string,
): string | null => {
  const { searchParams } = new URL(request.url)
  return searchParams.get(key)
}
