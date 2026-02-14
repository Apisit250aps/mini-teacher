namespace MiniTeacherService;

model Student {
  id: string;
  teacher: string;
  code: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CreateStudentBody {
  teacher: string;
  code: string;
  firstName: string;
  lastName: string;
  nickname?: string;
}

model UpdateStudentBody {
  teacher?: string;
  code?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  updatedAt?: utcDateTime;
}
