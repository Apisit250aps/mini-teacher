import type {
  User,
  Year,
  YearDetail,
  Class,
  Student,
  ClassMember,
  ClassMemberDetail,
  CheckDate,
  CheckStudent,
  CheckStudentDetail,
  ScoreAssign,
  ScoreStudent,
} from '@/models/domain'

interface UserRepository {
  createUser(user: User): Promise<User | null>
  updateUser(id: string, user: Partial<User>): Promise<User | null>
  deleteUser(id: string): Promise<boolean>
  findUserByName(name: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
  oAuthCreateUser(id: string, user: Partial<User>): Promise<User | null>
  findWithObjectId(id: string): Promise<User | null>
}

interface YearRepository {
  createYear(year: Year): Promise<Year>
  initYear(userId: string): Promise<void>
  updateYear(id: string, update: Partial<Year>): Promise<Year | null>
  getYearById(id: string): Promise<Year | null>
  getYearActive(): Promise<Year | null>
  getYearsByAuthUser(userId: string): Promise<Year[]>
  getYearsByYearTerm(year: number, term: number, user: string): Promise<Year | null>
  deleteYear(id: string): Promise<boolean>
  authDeleteYear(id: string, userId: string): Promise<boolean>
  authGetYearById(id: string, userId: string): Promise<Year | null>
  authGetAllYears(userId: string): Promise<YearDetail[]>
  authUpdateYear(id: string, userId: string, update: Partial<Year>): Promise<Year | null>
  authCreateYear(year: Year): Promise<Year>
  authSetActiveYear(userId: string, yearId: string): Promise<void>
  getUniqYear(userId: string, year: number, term: number): Promise<Year | null>
}

interface ClassRepository {
  createClass(newClass: Class): Promise<Class>
  updateClass(id: string, updatedClass: Partial<Class>): Promise<Class | null>
  deleteClass(id: string): Promise<void>
  getClassById(id: string): Promise<Class | null>
  getClassesByYear(yearId: string): Promise<Class[]>
  getClassByYearAndClassId(yearId: string, classId: string): Promise<Class | null>
}

interface StudentRepository {
  createStudent(data: Student): Promise<Student>
  teacherCreateStudent(data: Student): Promise<Student>
  updateStudent(id: string, data: Partial<Student>): Promise<Student | null>
  teacherUpdateStudent(id: string, data: Partial<Student>): Promise<Student | null>
  getStudentById(id: string): Promise<Student | null>
  getAllStudent(teacherId: string): Promise<Student[]>
  teacherGetAllStudent(teacherId: string): Promise<Student[]>
  deleteStudent(id: string): Promise<void>
  teacherDeleteStudent(id: string, teacherId: string): Promise<void>
}

interface ClassMemberRepository {
  addClassMember(classMember: ClassMember): Promise<ClassMember>
  deleteClassMember(classId: string, studentId: string): Promise<void>
  getUniqMember(classId: string, studentId: string): Promise<ClassMember | null>
  getClassMembersByClassId(classId: string): Promise<ClassMemberDetail[]>
}

interface CheckDateRepository {
  createCheckDate(checkDate: CheckDate): Promise<CheckDate>
  updateCheckDate(id: string, checkDate: Partial<CheckDate>): Promise<CheckDate>
  deleteCheckDate(id: string): Promise<void>
  getCheckDateById(id: string): Promise<CheckDate | null>
  getCheckDatesByClassId(classId: string): Promise<CheckDate[]>
}

interface CheckStudentRepository {
  createCheckStudent(data: CheckStudent): Promise<CheckStudent>
  updateCheckStudent(id: string, data: Partial<CheckStudent>): Promise<CheckStudent>
  deleteCheckStudent(id: string): Promise<void>
  getUniqueCheckStudent(checkDateId: string, studentId: string): Promise<CheckStudentDetail | null>
  getCheckStudentById(id: string): Promise<CheckStudentDetail | null>
}

interface ScoreAssignRepository {
  createScoreAssign(data: ScoreAssign): Promise<ScoreAssign>
  updateScoreAssign(assignId: string, data: Partial<ScoreAssign>): Promise<ScoreAssign | null>
  deleteScoreAssign(assignId: string): Promise<boolean>
  getScoreAssignsByClassId(classId: string): Promise<ScoreAssign[]>
  getScoreAssignById(classId: string, assignId: string): Promise<ScoreAssign | null>
}

interface ScoreStudentRepository {
  createScoreStudent(data: ScoreStudent): Promise<ScoreStudent>
  updateScoreStudent(id: string, score: number): Promise<ScoreStudent>
  getUniqueScoreStudent(scoreAssignId: string, studentId: string): Promise<ScoreStudent | null>
  getScoreStudentsByAssignId(scoreAssignId: string): Promise<ScoreStudent[]>
}

export type {
  UserRepository,
  YearRepository,
  ClassRepository,
  StudentRepository,
  ClassMemberRepository,
  CheckDateRepository,
  CheckStudentRepository,
  ScoreAssignRepository,
  ScoreStudentRepository,
}
