import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { UserLogin } from './models/entities'
import { updateUser } from './models/repositories'
import { verify } from './lib/utils/encryption'
import { usersCollection } from './lib/mongo'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { name, password } = credentials as UserLogin
        const users = await usersCollection()
        const user = await users.findOne({ name })
        if (!user) {
          return null
        }
        const isValid = await verify(user.password, password)
        if (!isValid || !user.isActive) {
          return null
        }
        await updateUser(user.id, {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.isActive = token.isActive as boolean
        session.user.isTeacher = token.isTeacher as boolean
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.isActive = user.isActive
        token.isTeacher = user.isTeacher
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      return token
    },
  },
})
