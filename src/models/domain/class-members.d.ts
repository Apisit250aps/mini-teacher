import type { Student } from './students'

interface ClassMember {
  id: string
  classId: string
  studentId: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface ClassMemberDetail extends ClassMember {
  student: Student
}

interface CreateClassMember {
  classId: string
  studentId: string
}

export type { ClassMember, ClassMemberDetail, CreateClassMember }
