namespace MiniTeacherService;

model UserData is PrismaModels.User;

model UserWithYears extends UserData {
  years: PrismaModels.Year[];
}

model UserCreateBody {
  name?: string | null;
  password?: string | null;
  email?: string | null;
  emailVerified?: utcDateTime | null;
  image?: string | null;
  isActive?: boolean;
  isTeacher?: boolean;
  isAdmin?: boolean;
  firstName?: string | null;
  lastName?: string | null;
}

model UserUpdateBody {
  name?: string | null;
  password?: string | null;
  email?: string | null;
  emailVerified?: utcDateTime | null;
  image?: string | null;
  isActive?: boolean;
  isTeacher?: boolean;
  isAdmin?: boolean;
  firstName?: string | null;
  lastName?: string | null;
}
