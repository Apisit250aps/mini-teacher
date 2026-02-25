import type { CheckDate } from '@/models/domain/check-dates'

interface CheckDateRepository {
  create(checkDate: CheckDate): Promise<CheckDate>
  update(id: string, checkDate: Partial<CheckDate>): Promise<CheckDate>
  delete(id: string): Promise<void>
  getById(id: string): Promise<CheckDate>
  getByClassId(classId: string): Promise<CheckDate[]>
}

export type { CheckDateRepository }
