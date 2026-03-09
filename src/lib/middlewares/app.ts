import { NextAuthRequest } from 'next-auth'

export const debugMiddlewares = (req: NextAuthRequest) => {
  const debug = false
  if (debug) {
    console.log('auth', req.auth)
  }
}
