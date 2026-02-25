import type { Class } from '@/models/domain/classes'

interface ClassRepository {
  create(newClass: Class): Promise<Class>
  update(id: string, data: Partial<Class>): Promise<Class | null>
  delete(id: string): Promise<void>
  getById(id: string): Promise<Class | null>
  getByYearId(yearId: string): Promise<Class[]>
  getUnique(yearId: string, classId: string): Promise<Class | null>
}

export type { ClassRepository }
