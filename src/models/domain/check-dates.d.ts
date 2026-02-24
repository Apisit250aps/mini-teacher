import { Class } from "./classes";

interface CheckDate {
  id: string
  classId: string
  isEditable: boolean
  date: string
  createdAt: Date
  updatedAt: Date
}

interface CheckDateCreate {
  classId: string
  isEditable?: boolean
  date: string
}

interface CheckDateUpdate extends Partial<CheckDateCreate> {
  id: string
}

interface CheckDateDetail extends CheckDate {
  class: Class
}

export type { CheckDate, CheckDateCreate, CheckDateUpdate, CheckDateDetail }
