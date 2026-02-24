import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model Student {
  id: string;
  teacher: string;
  code: string;
  prefix: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model StudentCreate {
  teacher: string;
  code: string;
  prefix: string;
  firstName: string;
  lastName: string;
  nickname?: string;
}

model StudentUpdate {
  id: string;
}

model StudentFormValue {
  prefix: string;
  code: string;
  firstName: string;
  lastName: string;
  nickname?: string;
}

