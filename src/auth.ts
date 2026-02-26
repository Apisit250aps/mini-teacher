import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './lib/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [Google],
  callbacks: {},
})
