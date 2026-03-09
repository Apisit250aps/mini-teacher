import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { signAuth } from './lib/middlewares/auth'
import { debugMiddlewares } from './lib/middlewares/app';

export default auth((req) =>
  useMiddlewares(req, [
    {
      prefix: '/',
      middlewares: [debugMiddlewares, signAuth],
    },
  ]),
)
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
