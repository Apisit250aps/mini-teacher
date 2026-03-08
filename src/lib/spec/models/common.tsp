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

model ErrorResponse401 {
  @statusCode statusCode: 401;
  @body body: ErrorResponse;
}

model ErrorResponse404 {
  @statusCode statusCode: 404;
  @body body: ErrorResponse;
}

model ErrorResponse409 {
  @statusCode statusCode: 409;
  @body body: ErrorResponse;
}

model ErrorResponse500 {
  @statusCode statusCode: 500;
  @body body: ErrorResponse;
}

union ApiError {
  ErrorResponse400,
  ErrorResponse401,
  ErrorResponse404,
  ErrorResponse409,
  ErrorResponse500,
}

model EmptyData {}
