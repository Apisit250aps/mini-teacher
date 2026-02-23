import type { Student } from '@/models/domain/students'

interface StudentRepository {
  createStudent(data: Student): Promise<Student>
  teacherCreateStudent(data: Student): Promise<Student>
  updateStudent(id: string, data: Partial<Student>): Promise<Student | null>
  teacherUpdateStudent(id: string, data: Partial<Student>): Promise<Student | null>
  getStudentById(id: string): Promise<Student | null>
  getAllStudent(teacherId: string): Promise<Student[]>
  teacherGetAllStudent(teacherId: string): Promise<Student[]>
  deleteStudent(id: string): Promise<void>
  teacherDeleteStudent(id: string, teacherId: string): Promise<void>
}

export type { StudentRepository }
