export type { SortOrder, QueryWhere, FindManyOptions } from './common'

export type {
  DocumentWithAcceptances,
  DocumentCreateData,
  DocumentUpdateData,
  DocumentQuery,
} from './document'
export type { CheckDateWithStudents, CheckDateQuery } from './check-date'
export type {
  CheckStudentWithRelations,
  CheckStudentQuery,
} from './check-student'
export type { ClassMemberWithStudent, ClassMemberQuery } from './class-member'
export type { ClassWithMembers, ClassWithDetails, ClassQuery } from './class'
export type { ScoreAssignWithScores, ScoreAssignQuery } from './score-assign'
export type { ScoreWithStudent, ScoreStudentQuery } from './score-student'
export type { StudentWithRelations, StudentQuery } from './student'
export type { UserWithYears } from './user'
export type {
  YearWithClasses,
  YearWithOwnerAndClasses,
  YearQuery,
} from './year'

export type { CheckDateCreateData, CheckDateUpdateData } from './check-date'
export type {
  CheckStudentCreateData,
  CheckStudentUpdateData,
} from './check-student'
export type { ClassMemberCreateData } from './class-member'
export type { ClassCreateData, ClassUpdateData } from './class'
export type {
  ScoreAssignCreateData,
  ScoreAssignUpdateData,
} from './score-assign'
export type {
  ScoreStudentCreateData,
  ScoreStudentUpdateData,
} from './score-student'
export type { StudentCreateData, StudentUpdateData } from './student'
export type { UserCreateData, UserUpdateData } from './user'
export type { YearCreateData, YearUpdateData } from './year'
