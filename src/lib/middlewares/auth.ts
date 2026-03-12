import { NextAuthRequest } from 'next-auth'
import { NextResponse } from 'next/server'

export const isAuthenticated = async (req: NextAuthRequest) => {
  const session = req.auth
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      { status: 401 },
    )
  }
}
