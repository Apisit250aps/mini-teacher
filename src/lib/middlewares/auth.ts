import { NextAuthRequest } from 'next-auth'
import { forbidden } from 'next/navigation'
import { NextResponse } from 'next/server'

export const isNoAuth = async (req: NextAuthRequest) => {
  const session = req.auth
  if (session) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
}

export const signAuth = async (req: NextAuthRequest) => {
  const session = req.auth?.user
  req.user = session
}

export const isAuthenticated = async (req: NextAuthRequest) => {
  const session = req.auth

  if (!session) {
    return forbidden()
  }
}
