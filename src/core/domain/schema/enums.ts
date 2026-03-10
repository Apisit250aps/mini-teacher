import z from 'zod'

const checkStatus = ['DEFAULT', 'PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const
const assignType = [
  'ASSIGNMENT',
  'HOMEWORK',
  'QUIZ',
  'EXAM',
  'PROJECT',
] as const

export const checkStatusSchema = z.enum(checkStatus)
export const assignTypeSchema = z.enum(assignType)
