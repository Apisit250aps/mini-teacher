// Auto-generated from prisma/schema.prisma. Do not edit manually.
import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService.PrismaModels;

enum CheckStatus {
  DEFAULT,
  PRESENT,
  ABSENT,
  LATE,
  LEAVE,
}

enum AssignType {
  ASSIGNMENT,
  HOMEWORK,
  QUIZ,
  EXAM,
  PROJECT,
}

@doc("DB table: users")
model User {
  @key
  id: string;
  name?: string | null;
  password?: string | null;
  email?: string | null;
  emailVerified?: utcDateTime | null;
  image?: string | null;
  isActive: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: accounts")
model Account {
  @key
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: int32 | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: sessions")
model Session {
  @key
  id: string;
  sessionToken: string;
  userId: string;
  expires: utcDateTime;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: verification_tokens")
model VerificationToken {
  @key
  id: string;
  identifier: string;
  token: string;
  expires: utcDateTime;
}

@doc("DB table: years")
model Year {
  @key
  id: string;
  userId: string;
  year: int32;
  term: int32;
  description?: string | null;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: classes")
model Class {
  @key
  id: string;
  yearId: string;
  name: string;
  subject: string;
  description?: string | null;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: students")
model Student {
  @key
  id: string;
  teacherId: string;
  code: string;
  prefix?: string | null;
  firstName: string;
  lastName: string;
  nickname?: string | null;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: class_members")
model ClassMember {
  @key
  id: string;
  classId: string;
  studentId: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  userId?: string | null;
}

@doc("DB table: check_dates")
model CheckDate {
  @key
  id: string;
  classId: string;
  date: utcDateTime;
  description?: string | null;
  isEditable: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: check_students")
model CheckStudent {
  @key
  id: string;
  checkDateId: string;
  studentId: string;
  status: CheckStatus;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: assignments")
model Assignment {
  @key
  id: string;
  classId: string;
  title: string;
  description?: string | null;
  minScore: int32;
  maxScore: int32;
  type: AssignType;
  assignDate?: utcDateTime | null;
  dueDate?: utcDateTime | null;
  isEditable: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("DB table: scores")
model Score {
  @key
  id: string;
  assignmentId: string;
  studentId: string;
  score: int32;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}
