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
}

model UpdateClassBody {
  year?: string;
  name?: string;
  subject?: string;
  isActive?: boolean;
  updatedAt?: utcDateTime;
}

model PatchClassMemberBody {
  studentId?: string;
}