import type { Year } from '../entities/year'
import type { Class } from '../entities/class'
import type { User } from '../entities/user'
import type { FindManyOptions } from './common'

export type YearWithClasses = Year & {
  classes: Class[]
}

export type YearWithOwnerAndClasses = Year & {
  classes: Class[]
  owner: User
}

export interface YearCreateData {
  userId: string
  year: number
  term: number
  description?: string | null
  isActive?: boolean
}

export interface YearUpdateData {
  year?: number
  term?: number
  description?: string | null
  isActive?: boolean
}

export type YearQuery = FindManyOptions<
  Pick<
    Year,
    'id' | 'userId' | 'year' | 'term' | 'isActive' | 'createdAt' | 'updatedAt'
  >
>
