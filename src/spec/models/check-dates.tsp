import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model CheckDate {
  id: string;
  classId: string;
  isEditable: boolean;
  date: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CheckDateCreate {
  classId: string;
  isEditable?: boolean;
  date: string;
}

model CheckDateUpdate {
  id: string;
}

model CheckDateDetail {
  class: Class;
}

