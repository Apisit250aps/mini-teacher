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

model CreateStudentBody {
  prefix: string;
  code: string;
  firstName: string;
  lastName: string;
  nickname?: string;
}

model UpdateStudentBody {
  prefix?: string;
  code?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}
