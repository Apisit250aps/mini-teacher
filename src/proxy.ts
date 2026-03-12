import { auth } from '@/auth'
import { useMiddlewares } from '@/lib/middlewares'
import { isAuthenticated } from './lib/middlewares/auth'
import { debugMiddlewares } from './lib/middlewares/app'

export default auth((req) =>
  useMiddlewares(req, [
    {
      prefix: '/',
      middlewares: [debugMiddlewares],
    },
    {
      prefix: '/api',
      middlewares: [isAuthenticated],
    },
  ]),
)
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * 1. Apply to all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * 2. Exclude /api/auth in all formats (e.g., /api/auth/signin, /api/auth/callback)
     * 3. But still apply to all other /api routes
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
