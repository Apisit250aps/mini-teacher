namespace MiniTeacherService;

model Year {
  id: string;
  user: string;
  year: int32;
  term: int32;
  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model YearDetail extends Year {
  classes: Class[];
}

model CreateYearBody {
  year: int32;
  term: int32;
  isActive?: boolean;
}

model UpdateYearBody {
  user?: string;
  year?: int32;
  term?: int32;
  isActive?: boolean;
  updatedAt?: utcDateTime;
}
