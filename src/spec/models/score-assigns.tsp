import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model ScoreAssign {
  id: string;
  classId: string;
  isEditable: boolean;
  name: string;
  description?: string | null;
  minScore: float64;
  maxScore: float64;
  type: AssignType;
  assignDate: utcDateTime;
  finalDate: utcDateTime;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model ScoreAssignDetail {
  scores: ScoreStudentDetail[];
}

model CreateScoreAssign {
  classId: string;
  isEditable?: boolean;
  name: string;
  description?: string | null;
  minScore?: float64;
  maxScore?: float64;
  type?: AssignType;
  assignDate?: utcDateTime;
  finalDate?: utcDateTime;
}

model UpdateScoreAssign {
  id: string;
}

