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
  events: {
    async createUser({ user }) {
      try {
        if (!user.id) return
        const [tos, pp] = await Promise.all([
          prisma.document.findFirst({
            where: { type: 'TOS', isActive: true },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.document.findFirst({
            where: { type: 'PRIVACY_POLICY', isActive: true },
            orderBy: { createdAt: 'desc' },
          }),
        ])
        const records: { userId: string; documentId: string }[] = []
        if (tos) records.push({ userId: user.id, documentId: tos.id })
        if (pp) records.push({ userId: user.id, documentId: pp.id })
        if (records.length) {
          await prisma.userAcceptance.createMany({ data: records })
        }
      } catch (e) {
        console.error('Failed to record user acceptance on createUser:', e)
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isActive = user.isActive
        token.isTeacher = user.isTeacher
        token.isAdmin = user.isAdmin
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      if (token.sub) {
        const [latestTos, latestPp] = await Promise.all([
          prisma.document.findFirst({
            where: { type: 'TOS', isActive: true },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.document.findFirst({
            where: { type: 'PRIVACY_POLICY', isActive: true },
            orderBy: { createdAt: 'desc' },
          }),
        ])
        const [tosAccepted, ppAccepted] = await Promise.all([
          latestTos
            ? prisma.userAcceptance.findFirst({
                where: { userId: token.sub, documentId: latestTos.id },
              })
            : null,
          latestPp
            ? prisma.userAcceptance.findFirst({
                where: { userId: token.sub, documentId: latestPp.id },
              })
            : null,
        ])
        token.hasAcceptedLatestTos = !!tosAccepted
        token.hasAcceptedLatestPp = !!ppAccepted
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.isActive = token.isActive as boolean
        session.user.isTeacher = token.isTeacher as boolean
        session.user.isAdmin = token.isAdmin as boolean
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
        session.user.hasAcceptedLatestTos = token.hasAcceptedLatestTos
        session.user.hasAcceptedLatestPp = token.hasAcceptedLatestPp
      }
      return session
    },
  },
})
