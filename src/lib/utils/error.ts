import { NextResponse } from 'next/server'

const APP_ERROR_STATUS_MAP = {
  VALIDATE_ERROR: 400,
  DATA_EXIST: 409,
  UNAUTHERLIZE: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type AppErrorCode = keyof typeof APP_ERROR_STATUS_MAP

export class AppError extends Error {
  code: AppErrorCode
  statusCode: number
  details?: unknown

  constructor(message: string, code: AppErrorCode, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = APP_ERROR_STATUS_MAP[code]
    this.details = details
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError

export const getHttpStatusFromErrorCode = (code: AppErrorCode): number =>
  APP_ERROR_STATUS_MAP[code]

export const normalizeAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error
  }

  if (error instanceof SyntaxError) {
    return new AppError(error.message, 'VALIDATE_ERROR')
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'INTERNAL_SERVER_ERROR')
  }

  return new AppError('เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น', 'INTERNAL_SERVER_ERROR')
}

export const toErrorResponse = (
  error: unknown,
  fallbackMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น',
) => {
  const appError = normalizeAppError(error)
  return NextResponse.json(
    {
      success: false,
      message: appError.message || fallbackMessage,
      error: appError.code,
    } satisfies ApiResponse,
    { status: appError.statusCode },
  )
}
