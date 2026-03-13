namespace MiniTeacherService;

model DocumentData is PrismaModels.Document;

model DocumentWithAcceptances extends DocumentData {
  acceptances: PrismaModels.UserAcceptance[];
}

model DocumentCreateBody {
  type: PrismaModels.DocumentType;
  version: string;
  content: string;
  language?: PrismaModels.DocumentLanguage;
  isActive?: boolean;
}

model DocumentUpdateBody {
  content?: string;
  isActive?: boolean;
}
