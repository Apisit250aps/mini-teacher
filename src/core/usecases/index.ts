import {
  checkDateRepository,
  checkStudentRepository,
  classMemberRepository,
  classRepository,
  scoreAssignRepository,
  scoreStudentRepository,
  studentRepository,
  userRepository,
  yearRepository,
} from '@/core/repositories'

import { createCheckDateUseCase } from './check-date.usecase'
import { createCheckStudentUseCase } from './check-student.usecase'
import { createClassMemberUseCase } from './class-member.usecase'
import { createClassUseCase } from './class.usecase'
import { createScoreAssignUseCase } from './score-assign.usecase'
import { createScoreStudentUseCase } from './score-student.usecase'
import { createStudentUseCase } from './student.usecase'
import { createUserUseCase } from './user.usecase'
import { createYearUseCase } from './year.usecase'

export const userUseCase = createUserUseCase(userRepository)
export const yearUseCase = createYearUseCase(yearRepository)
export const classUseCase = createClassUseCase(classRepository)
export const studentUseCase = createStudentUseCase(studentRepository)
export const classMemberUseCase = createClassMemberUseCase(
  classMemberRepository,
)
export const checkDateUseCase = createCheckDateUseCase(checkDateRepository)
export const checkStudentUseCase = createCheckStudentUseCase(
  checkStudentRepository,
)
export const scoreAssignUseCase = createScoreAssignUseCase(
  scoreAssignRepository,
)
export const scoreStudentUseCase = createScoreStudentUseCase(
  scoreStudentRepository,
)

export * from './user.usecase'
export * from './year.usecase'
export * from './class.usecase'
export * from './student.usecase'
export * from './class-member.usecase'
export * from './check-date.usecase'
export * from './check-student.usecase'
export * from './score-assign.usecase'
export * from './score-student.usecase'

export type { CheckDateUseCase } from '@/core/domain/usecases/check-date'
export type { CheckStudentUseCase } from '@/core/domain/usecases/check-student'
export type { ClassMemberUseCase } from '@/core/domain/usecases/class-member'
export type { ClassUseCase } from '@/core/domain/usecases/class'
export type { ScoreAssignUseCase } from '@/core/domain/usecases/score-assign'
export type { ScoreStudentUseCase } from '@/core/domain/usecases/score-student'
export type { StudentUseCase } from '@/core/domain/usecases/student'
export type { UserUseCase } from '@/core/domain/usecases/user'
export type { YearUseCase } from '@/core/domain/usecases/year'
