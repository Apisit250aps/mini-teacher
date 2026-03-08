import type { ClassMember } from '../entities/class-member'
import type {
  ClassMemberCreateData,
  ClassMemberQuery,
  ClassMemberWithStudent,
} from '../data/class-member'

interface ClassMemberRepository {
  create: (data: ClassMemberCreateData) => Promise<ClassMember>
  delete: (classId: string, studentId: string) => Promise<void>
  getUnique: (classId: string, studentId: string) => Promise<ClassMember | null>
  getByClassId: (
    classId: string,
    filter?: ClassMemberQuery,
  ) => Promise<ClassMemberWithStudent[]>
}

export type { ClassMemberRepository, ClassMemberWithStudent }
