import type { Student } from './students'

interface ClassMember {
  id: string
  classId: string
  studentId: string
  createdAt: Date
  updatedAt: Date
}

interface ClassMemberDetail extends ClassMember {
  student: Student
}

interface CreateClassMember {
  classId: string
  studentId: string
}

export type { ClassMember, ClassMemberDetail, CreateClassMember }
