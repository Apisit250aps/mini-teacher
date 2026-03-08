import type {
  ClassMemberCreateData,
  ClassMemberQuery,
} from '../data/class-member'
import type { ClassMemberRepository } from '../repositories/class-member'

interface ClassMemberUseCase {
  create: (
    data: ClassMemberCreateData,
  ) => Promise<Awaited<ReturnType<ClassMemberRepository['create']>>>
  delete: (classId: string, studentId: string) => Promise<void>
  getUnique: (
    classId: string,
    studentId: string,
  ) => Promise<Awaited<ReturnType<ClassMemberRepository['getUnique']>>>
  getByClassId: (
    classId: string,
    filter?: ClassMemberQuery,
  ) => Promise<Awaited<ReturnType<ClassMemberRepository['getByClassId']>>>
}

export type { ClassMemberUseCase }
