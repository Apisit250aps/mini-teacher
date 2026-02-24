interface Student {
  id: string
  teacher: string
  code: string
  prefix: string
  firstName: string
  lastName: string
  nickname?: string
  createdAt: Date
  updatedAt: Date
}

interface StudentCreate {
  teacher: string
  code: string
  prefix: string
  firstName: string
  lastName: string
  nickname?: string
}

interface StudentUpdate extends Partial<StudentCreate> {
  id: string
}

interface StudentFormValue {
  prefix: string
  code: string
  firstName: string
  lastName: string
  nickname?: string
}

export type { Student, StudentCreate, StudentUpdate, StudentFormValue }
