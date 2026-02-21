namespace MiniTeacherService;

model ScoreAssign {
  id: string;
  classId: string;
  name: string;
  description?: string | null;
  minScore: int32 = 0;
  maxScore: int32 = 100;
  type: "ASSIGNMENT" | "QUIZ" | "EXAM" = "ASSIGNMENT";
  assignDate?: utcDateTime | null;
  finalDate?: utcDateTime | null;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ScoreAssignDetail {
  id: string;
  classId: string;
  name: string;
  description?: string | null;
  minScore: int32 = 0;
  maxScore: int32 = 100;
  type: "ASSIGNMENT" | "QUIZ" | "EXAM" = "ASSIGNMENT";
  assignDate?: utcDateTime | null;
  finalDate?: utcDateTime | null;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  scores: ScoreStudentDetail[];
}

model ScoreStudent {
  id: string;
  scoreAssignId: string;
  studentId: string;
  score: int32;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ScoreStudentDetail {
  id: string;
  scoreAssignId: string;
  studentId: string;
  score: int32;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  student: Student;
}

model CreateScoreAssignBody {
  name: string;
  description?: string | null;
  minScore?: int32;
  maxScore?: int32;
  type?: "ASSIGNMENT" | "QUIZ" | "EXAM";
  assignDate?: utcDateTime | null;
  finalDate?: utcDateTime | null;
}

model UpdateScoreAssignBody {
  name?: string;
  description?: string | null;
  minScore?: int32;
  maxScore?: int32;
  type?: "ASSIGNMENT" | "QUIZ" | "EXAM";
  assignDate?: utcDateTime | null;
  finalDate?: utcDateTime | null;
}

model CreateScoreStudentBody {
  studentId: string;
  score: int32;
}

model UpdateScoreStudentBody {
  score: int32;
}
