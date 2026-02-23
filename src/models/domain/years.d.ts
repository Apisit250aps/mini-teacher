import { Class } from './classes'

interface Year {
  id: string
  user: string
  year: number
  term: number
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

interface CreateYear {
  user: string
  year: number
  term: number
  isActive?: boolean
}

interface UpdateYear extends Partial<CreateYear> {
  id: string
}

interface YearDetail extends Year {
  classes: Class[]
}

export type { Year, CreateYear, UpdateYear, YearDetail }
