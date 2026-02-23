interface CheckDate {
  id: string
  classId: string
  isEditable: boolean
  date: string
  createdAt: Date
  updatedAt: Date
}

interface CreateCheckDate {
  classId: string
  isEditable?: boolean
  date: string
}

interface UpdateCheckDate extends Partial<CreateCheckDate> {
  id: string
}

export type { CheckDate, CreateCheckDate, UpdateCheckDate }
