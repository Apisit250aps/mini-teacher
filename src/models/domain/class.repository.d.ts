import type { Class } from '@/models/domain/classes'

interface ClassRepository {
  createClass(newClass: Class): Promise<Class>
  updateClass(id: string, updatedClass: Partial<Class>): Promise<Class | null>
  deleteClass(id: string): Promise<void>
  getClassById(id: string): Promise<Class | null>
  getClassesByYear(yearId: string): Promise<Class[]>
  getClassByYearAndClassId(yearId: string, classId: string): Promise<Class | null>
}

export type { ClassRepository }
