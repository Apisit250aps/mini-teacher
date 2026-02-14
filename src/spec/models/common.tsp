namespace MiniTeacherService;

model ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

model EmptyData {}
