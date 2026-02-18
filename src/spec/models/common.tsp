using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniTeacherService;

model ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

model ErrorResponse {
  success: boolean;
  message: string;
  error: string;
}

model ErrorResponse400 {
  @statusCode statusCode: 400;
  @body body: ErrorResponse;
}

model ErrorResponse500 {
  @statusCode statusCode: 500;
  @body body: ErrorResponse;
}

union ApiError {
  ErrorResponse400,
  ErrorResponse500,
}

model EmptyData {}
