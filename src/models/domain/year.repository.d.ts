import type { Year, YearDetail } from '@/models/domain/years'

interface YearRepository {
  createYear(year: Year): Promise<Year>
  initYear(userId: string): Promise<void>
  updateYear(id: string, update: Partial<Year>): Promise<Year | null>
  getYearById(id: string): Promise<Year | null>
  getYearActive(): Promise<Year | null>
  getYearsByAuthUser(userId: string): Promise<Year[]>
  getYearsByYearTerm(year: number, term: number, user: string): Promise<Year | null>
  deleteYear(id: string): Promise<boolean>
  authDeleteYear(id: string, userId: string): Promise<boolean>
  authGetYearById(id: string, userId: string): Promise<Year | null>
  authGetAllYears(userId: string): Promise<YearDetail[]>
  authUpdateYear(id: string, userId: string, update: Partial<Year>): Promise<Year | null>
  authCreateYear(year: Year): Promise<Year>
  authSetActiveYear(userId: string, yearId: string): Promise<void>
  getUniqYear(userId: string, year: number, term: number): Promise<Year | null>
}

export type { YearRepository }
