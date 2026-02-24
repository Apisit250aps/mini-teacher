import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model ClassMember {
  id: string;
  classId: string;
  studentId: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ClassMemberDetail {
  student: Student;
}

model CreateClassMember {
  classId: string;
  studentId: string;
}

