namespace MiniTeacherService;

model StudentData is PrismaModels.Student;

model StudentClassMemberWithClass extends PrismaModels.ClassMember {
  class: PrismaModels.Class;
}

model StudentCheckWithDate extends PrismaModels.CheckStudent {
  checkDate: PrismaModels.CheckDate;
}

model StudentScoreWithAssignment extends PrismaModels.Score {
  assignment: PrismaModels.Assignment;
}

model StudentWithRelations extends StudentData {
  classMembers: StudentClassMemberWithClass[];
  checkStudents: StudentCheckWithDate[];
  scores: StudentScoreWithAssignment[];
}

model StudentCreateBody {
  teacherId: string;
  code: string;
  prefix?: string | null;
  firstName: string;
  lastName: string;
  nickname?: string | null;
}

model StudentUpdateBody {
  code?: string;
  prefix?: string | null;
  firstName?: string;
  lastName?: string;
  nickname?: string | null;
}
