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
  code: string;
  firstName: string;
  lastName: string;
  nickname?: string;
}

model UpdateStudentBody {
  code?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}
