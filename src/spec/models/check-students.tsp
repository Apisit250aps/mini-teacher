import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model CheckStudent {
  id: string;
  checkDateId: string;
  studentId: string;
  status: CheckStatus;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CheckStudentDetail {
  student: Student;
}

model CheckStudentCreate {
  checkDateId: string;
  studentId: string;
  status?: CheckStatus;
}

model CheckStudentUpdate {
  id: string;
}

