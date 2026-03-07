namespace MiniTeacherService;

model CheckDate {
  id: string;
  classId: string;
  date: string;
  isEditable: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CheckStudent {
  id: string;
  checkDateId: string;
  studentId: string;
  status: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CheckDateWithStudents extends CheckDate {
  checkStudents: CheckStudent[];
}

model CreateCheckDateBody {
  date: string;
}

model UpdateCheckDateBody {
  date?: string;
  isEditable?: boolean;
}

model CreateCheckStudentBody {
  studentId: string;
  status: string;
}
