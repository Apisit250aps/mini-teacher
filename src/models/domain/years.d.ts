import { Class } from './classes'

interface Year {
  id: string
  user: string
  year: number
  term: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
interface YearCreate {
  year: number
  term: number
}
interface YearUpdate {
  id: string
  year?: number
  term?: number
  isActive?: boolean
}

interface YearForm {
  year: number
  term: number
  isActive: boolean
}

// type YearDetail = Year & { classes: Class[] }
interface YearDetail extends Year {
  classes: Class[]
}

export type { Year, YearCreate, YearUpdate, YearDetail, YearForm }
