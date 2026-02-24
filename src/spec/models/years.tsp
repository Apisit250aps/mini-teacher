import "@typespec/http";
using TypeSpec.Http;

namespace MiniTeacherService;

model Year {
  id: string;
  user: string;
  year: float64;
  term: float64;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model YearCreate {
  year: float64;
  term: float64;
}

model YearUpdate {
  id: string;
  year?: float64;
  term?: float64;
  isActive?: boolean;
}

model YearForm {
  year: float64;
  term: float64;
  isActive: boolean;
}

model YearDetail {
  classes: Class[];
}

