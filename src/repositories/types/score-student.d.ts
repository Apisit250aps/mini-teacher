import type { Prisma, Score } from '@prisma'

type ScoreWithStudent = Prisma.ScoreGetPayload<{
  include: { student: true }
}>

type ScoreStudentRepository = {
  create: (data: Prisma.ScoreCreateInput) => Promise<Score>
  update: (id: string, score: number) => Promise<Score>
  delete: (id: string) => Promise<void>
  getUnique: (assignmentId: string, studentId: string) => Promise<Score | null>
  getByAssignmentId: (
    assignmentId: string,
    filter?: Prisma.ScoreFindManyArgs,
  ) => Promise<ScoreWithStudent[]>
}

export type { ScoreStudentRepository, ScoreWithStudent }
