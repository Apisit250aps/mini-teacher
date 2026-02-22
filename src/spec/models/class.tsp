namespace MiniTeacherService;

model Class {
  id: string;
  year: string;
  name: string;
  subject: string;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CreateClassBody {
  year: string;
  name: string;
  subject: string;
  isActive?: boolean;
  description?: string;
}

model UpdateClassBody {
  year?: string;
  name?: string;
  subject?: string;
  isActive?: boolean;
  updatedAt?: utcDateTime;
  description?: string;
}

model PatchClassMemberBody {
  studentId?: string;
}

model ClassMemberDetail {
  id: string;
  classId: string;
  studentId: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  student: {
    id: string;
    teacher: string;
    code: string;
    prefix: string;
    firstName: string;
    lastName: string;
    createdAt: utcDateTime;
    updatedAt: utcDateTime;
    nickname?: string;
  };
}
