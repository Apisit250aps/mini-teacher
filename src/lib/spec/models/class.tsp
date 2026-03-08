namespace MiniTeacherService;

model ClassData is PrismaModels.Class;

model ClassMemberData is PrismaModels.ClassMember;

model ClassMemberWithStudent extends ClassMemberData {
  student: PrismaModels.Student;
}

model ClassWithMembers extends ClassData {
  classMembers: ClassMemberWithStudent[];
}

model ClassWithDetails extends ClassData {
  year: PrismaModels.Year;
  classMembers: ClassMemberWithStudent[];
  checkDates: PrismaModels.CheckDate[];
  assignments: PrismaModels.Assignment[];
}

model ClassCreateBody {
  yearId: string;
  name: string;
  subject: string;
  description?: string | null;
  isActive?: boolean;
}

model ClassUpdateBody {
  yearId?: string;
  name?: string;
  subject?: string;
  description?: string | null;
  isActive?: boolean;
}

model ClassMemberCreateBody {
  classId: string;
  studentId: string;
  userId?: string | null;
}

model ClassMemberDeleteBody {
  classId?: string;
  studentId?: string;
}
