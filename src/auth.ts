import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { AuthUpdateUser } from '@/models/entities'
import type { UserLogin } from '@/models/domain'
import {
  findWithObjectId,
  oAuthCreateUser,
  updateUser,
} from '@/models/repositories'
import { verify } from '@/lib/utils/encryption'
import { usersCollection } from '@/lib/mongo'
import Google from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from './lib/mongo/client'
import { safeValidate } from './lib/utils'
import z from 'zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google,
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
    async jwt({ token, user }) {
      if (user) {
        if (z.uuid().safeParse(user.id).success) {
          token.sub = user.id
        } else {
          const u = await findWithObjectId(user.id)
          token.sub = u?.id
        }
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
  events: {
    createUser: async ({ user }) => {
      const validate = await safeValidate(AuthUpdateUser, {
        name: user.name || '',
      })
      if (validate.data) {
        const { name, email, isActive, isTeacher } = validate.data
        await oAuthCreateUser(user.id!, { name, email, isActive, isTeacher })
      }
    },
  },
})
