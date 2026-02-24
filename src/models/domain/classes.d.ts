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

interface ClassCreate {
  year: string
  name: string
  subject: string
  description: string
  isActive?: boolean
}

interface ClassUpdate extends Partial<ClassCreate> {
  id: string
}

interface ClassDetail extends Class {
  members: Student[]
}

interface ClassFormValue {
  year: string
  name: string
  subject: string
  description: string
}

interface ClassMemberAdd {
  studentId: string
}



export type {
  Class,
  ClassCreate,
  ClassUpdate,
  ClassDetail,
  ClassFormValue,
  ClassMemberAdd,
}
