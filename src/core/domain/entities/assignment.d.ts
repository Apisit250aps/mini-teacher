// Auto-generated from prisma/schema.prisma. Do not edit manually.

export interface Assignment {
  id: string
  classId: string
  title: string
  description?: string | null
  minScore: number
  maxScore: number
  type: AssignType
  assignDate?: Date | null
  dueDate?: Date | null
  isEditable: boolean
  createdAt: Date
  updatedAt: Date
}
