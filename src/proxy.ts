import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { isAuthenticated, isNoAuth } from '@/lib/middlewares/auth'
import { NextAuthRequest } from 'next-auth'

const debugMiddlewares = (req: NextAuthRequest) => {
  console.log('Request URL:', req.auth)
  console.log('Request Method:', req.method)
}

export default auth((req) =>
  useMiddlewares(req, [
    {
      prefix: '/',
      middlewares: [debugMiddlewares],
    },
    {
      paths: ['/login'],
      middlewares: [isNoAuth],
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
