import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { isAuthenticated, isNoAuth } from '@/lib/middlewares/auth'
import { NextAuthRequest } from 'next-auth'
import { NextResponse } from 'next/server'

const toDashboard = (req: NextAuthRequest) => {
  return NextResponse.redirect(new URL('/class', req.nextUrl))
}

export default auth((req) =>
  useMiddlewares(req, [
    {
      paths: ['/login'],
      middlewares: [isNoAuth],
    },
    {
      paths: ['/'],
      middlewares: [toDashboard],
    },
    {
      paths: ['/class/*'],
      middlewares: [isAuthenticated],
    },
  ]),
)
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
