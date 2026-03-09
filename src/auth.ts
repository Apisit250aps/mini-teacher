import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isActive = user.isActive
        token.isTeacher = user.isTeacher
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      return token
    },
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
  },
})
