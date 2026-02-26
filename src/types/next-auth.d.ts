import { DefaultUser } from 'next-auth'
export type { Adapter } from 'next-auth/adapters'

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User  {
  
  
    isActive: boolean
    isTeacher: boolean
    firstName?: string
    lastName?: string
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: User
  }

  interface NextAuthRequest {
    user?: User
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    id: string

    name?: string | null
    email: string
    emailVerified: Date | null
    image?: string | null

    isActive: boolean
    isTeacher: boolean
    firstName?: string
    lastName?: string
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string

    name?: string | null
    email: string
    emailVerified: Date | null
    image?: string | null

    isActive: boolean
    isTeacher: boolean
    firstName?: string
    lastName?: string
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    idToken?: string
    isActive?: boolean
    isTeacher?: boolean
    firstName?: string
    lastName?: string
  }
}