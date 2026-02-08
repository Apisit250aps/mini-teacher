import { AxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function zodError<T>(error: z.ZodError<T>): string {
  return `${error.issues[0].message}`
}

export async function safeValidate<T>(
  schema: z.ZodType<T>,
  payload: unknown,
): Promise<{ data: T | null; error: string | null }> {
  const { data, error } = await schema.safeParseAsync(payload)
  return { data: data ?? null, error: error ? zodError(error) : null }
}

export function onErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return zodError(error)
  } else if (error instanceof AxiosError) {
    return (
      (error.response?.data.error as string) || 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น'
    )
  } else if (typeof error === 'string') {
    return error
  } else if (error instanceof Error) {
    return error.message
  }
  return 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น'
}
