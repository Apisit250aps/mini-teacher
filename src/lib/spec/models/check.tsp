namespace MiniTeacherService;

model CheckDateData is PrismaModels.CheckDate;

model CheckStudentData is PrismaModels.CheckStudent;

model CheckStudentWithStudent extends CheckStudentData {
  student: PrismaModels.Student;
}

model CheckDateWithStudents extends CheckDateData {
  checkStudents: CheckStudentWithStudent[];
}

model CheckStudentWithRelations extends CheckStudentData {
  student: PrismaModels.Student;
  checkDate: PrismaModels.CheckDate;
}

model CheckDateCreateBody {
  classId: string;
  date: utcDateTime;
  description?: string | null;
  isEditable?: boolean;
}

model CheckDateUpdateBody {
  date?: utcDateTime;
  description?: string | null;
  isEditable?: boolean;
}

model CheckStudentCreateBody {
  checkDateId: string;
  studentId: string;
  status?: PrismaModels.CheckStatus;
}

model CheckStudentUpdateBody {
  status?: PrismaModels.CheckStatus;
}
