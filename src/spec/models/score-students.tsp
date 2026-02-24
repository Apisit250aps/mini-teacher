import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model ScoreStudent {
  id: string;
  scoreAssignId: string;
  studentId: string;
  score: float64;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ScoreStudentDetail {
  student: Student;
}

model CreateScoreStudent {
  scoreAssignId: string;
  studentId: string;
  score?: float64;
}

model UpdateScoreStudent {
  id: string;
}

