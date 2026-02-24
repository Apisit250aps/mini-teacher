import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model Class {
  id: string;
  year: string;
  name: string;
  subject: string;
  description: string;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ClassCreate {
  year: string;
  name: string;
  subject: string;
  description: string;
  isActive?: boolean;
}

model ClassUpdate {
  id: string;
}

model ClassDetail {
  members: Student[];
}

model ClassFormValue {
  year: string;
  name: string;
  subject: string;
  description: string;
}

model ClassMemberAdd {
  studentId: string;
}

