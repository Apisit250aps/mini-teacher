interface Class {
  id: string
  year: string
  name: string
  subject: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface CreateClass {
  year: string
  name: string
  subject: string
  description: string
  isActive?: boolean
}

interface UpdateClass extends Partial<CreateClass> {
  id: string
}

interface ClassFormValue {
  year: string
  name: string
  subject: string
  description: string
}

export type { Class, CreateClass, UpdateClass, ClassFormValue }