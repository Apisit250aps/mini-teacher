interface Student {
  id: string
  teacher: string
  code: string
  prefix: string
  firstName: string
  lastName: string
  nickname?: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface CreateStudent {
  teacher: string
  code: string
  prefix: string
  firstName: string
  lastName: string
  nickname?: string
}

interface UpdateStudent extends Partial<CreateStudent> {
  id: string
}

interface StudentFormValue {
  prefix: string
  code: string
  firstName: string
  lastName: string
  nickname?: string
}

export type { Student, CreateStudent, UpdateStudent, StudentFormValue }
