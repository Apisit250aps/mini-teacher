import type { CheckDate } from '@/models/domain/check-dates'

interface CheckDateRepository {
  createCheckDate(checkDate: CheckDate): Promise<CheckDate>
  updateCheckDate(id: string, checkDate: Partial<CheckDate>): Promise<CheckDate>
  deleteCheckDate(id: string): Promise<void>
  getCheckDateById(id: string): Promise<CheckDate | null>
  getCheckDatesByClassId(classId: string): Promise<CheckDate[]>
}

export type { CheckDateRepository }
