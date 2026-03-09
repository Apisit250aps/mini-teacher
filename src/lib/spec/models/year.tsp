namespace MiniTeacherService;

model YearData is PrismaModels.Year;

model YearWithClasses extends YearData {
  classes: PrismaModels.Class[];
}

model YearWithOwnerAndClasses extends YearData {
  owner: PrismaModels.User;
  classes: PrismaModels.Class[];
}

model YearCreateBody {
  year: int32;
  term: int32;
  description?: string | null;
  isActive?: boolean;
}

model YearUpdateBody {
  year?: int32;
  term?: int32;
  description?: string | null;
  isActive?: boolean;
}

model SetActiveYearBody {
  userId?: string;
  yearId?: string;
}
