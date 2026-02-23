import { Class } from './classes'

type Year = {
  id: string
  user: string
  year: number
  term: number
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}
type CreateYear = Omit<Year, 'id' | 'createdAt' | 'updatedAt'>
type UpdateYear = Partial<CreateYear> & { id: string }
type YearForm = Omit<CreateYear, 'user' | 'isActive'>
// type YearDetail = Year & { classes: Class[] }
interface YearDetail extends Year {
  classes: Class[]
}

export type { Year, CreateYear, UpdateYear, YearDetail, YearForm }
