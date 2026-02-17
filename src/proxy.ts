import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { NextAuthRequest } from 'next-auth'

const debugMiddlewares = (req: NextAuthRequest) => {
  const debug = false
  if (debug) {
    console.log('auth', req.auth)
  }
}

export default auth((req) =>
  useMiddlewares(req, [
    {
      prefix: '/',
      middlewares: [debugMiddlewares],
    },
  ]),
)
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
