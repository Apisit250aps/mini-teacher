import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model User {
  id: string;
  name: string;
  password: string;
  isActive: boolean;
  isTeacher: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  lastLoginAt?: utcDateTime;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CreateUser {
  name: string;
  password: string;
  isActive?: boolean;
  isTeacher?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
}

model UpdateUser {
  id: string;
}

model UserLogin {
  name: string;
  password: string;
}

