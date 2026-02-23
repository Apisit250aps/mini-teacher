import type { ClassMember, ClassMemberDetail } from '@/models/domain/class-members'

interface ClassMemberRepository {
  addClassMember(classMember: ClassMember): Promise<ClassMember>
  deleteClassMember(classId: string, studentId: string): Promise<void>
  getUniqMember(classId: string, studentId: string): Promise<ClassMember | null>
  getClassMembersByClassId(classId: string): Promise<ClassMemberDetail[]>
}

export type { ClassMemberRepository }
