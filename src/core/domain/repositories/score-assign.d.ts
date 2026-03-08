import type { Assignment, Prisma } from '@prisma'

type ScoreAssignWithScores = Prisma.AssignmentGetPayload<{
  include: { scores: { include: { student: true } } }
}>

type ScoreAssignRepository = {
  create: (data: Prisma.AssignmentCreateInput) => Promise<Assignment>
  update: (
    id: string,
    data: Prisma.AssignmentUpdateInput,
  ) => Promise<Assignment>
  delete: (id: string) => Promise<void>
  getByClassId: (
    classId: string,
    filter?: Prisma.AssignmentFindManyArgs,
  ) => Promise<ScoreAssignWithScores[]>
  getById: (
    classId: string,
    assignId: string,
  ) => Promise<ScoreAssignWithScores | null>
  getUniqueByTitle: (
    classId: string,
    title: string,
  ) => Promise<Assignment | null>
}

export type { ScoreAssignRepository, ScoreAssignWithScores }
