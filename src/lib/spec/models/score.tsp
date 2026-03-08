namespace MiniTeacherService;

model ScoreAssignData is PrismaModels.Assignment;

model ScoreStudentData is PrismaModels.Score;

model ScoreStudentWithStudent extends ScoreStudentData {
  student: PrismaModels.Student;
}

model ScoreAssignWithScores extends ScoreAssignData {
  scores: ScoreStudentWithStudent[];
}

model ScoreAssignCreateBody {
  classId: string;
  title: string;
  description?: string | null;
  minScore?: int32;
  maxScore?: int32;
  type?: PrismaModels.AssignType;
  assignDate?: utcDateTime | null;
  dueDate?: utcDateTime | null;
  isEditable?: boolean;
}

model ScoreAssignUpdateBody {
  title?: string;
  description?: string | null;
  minScore?: int32;
  maxScore?: int32;
  type?: PrismaModels.AssignType;
  assignDate?: utcDateTime | null;
  dueDate?: utcDateTime | null;
  isEditable?: boolean;
}

model ScoreStudentCreateBody {
  assignmentId: string;
  studentId: string;
  score: int32;
}

model ScoreStudentUpdateBody {
  score: int32;
}
