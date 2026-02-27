import type { NextAuthRequest } from 'next-auth'
import createYear from './create'
import { Prisma } from '@prisma'
import type { NextResponse } from 'next/server'

class YearController {
  createYear = createYear
}
export default YearController
