import type { CheckDate } from '../entities/check-date'
import type {
  CheckDateCreateData,
  CheckDateQuery,
  CheckDateUpdateData,
  CheckDateWithStudents,
} from '../data/check-date'

interface CheckDateRepository {
  create: (data: CheckDateCreateData) => Promise<CheckDate>
  update: (id: string, data: CheckDateUpdateData) => Promise<CheckDate>
  delete: (id: string) => Promise<void>
  getById: (id: string) => Promise<CheckDateWithStudents | null>
  getByClassId: (
    classId: string,
    filter?: CheckDateQuery,
  ) => Promise<CheckDateWithStudents[]>
  getUniqueByDate: (classId: string, date: Date) => Promise<CheckDate | null>
}

export type { CheckDateRepository, CheckDateWithStudents }
