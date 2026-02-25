import type {
  ClassMember,
  ClassMemberDetail,
} from '@/models/domain/class-members'

interface ClassMemberRepository {
  create(classMember: ClassMember): Promise<ClassMember>
  delete(id: string): Promise<void>
  getUnique(classId: string, studentId: string): Promise<ClassMember | null>
  getByClassId(classId: string): Promise<ClassMemberDetail[]>
}

export type { ClassMemberRepository }
