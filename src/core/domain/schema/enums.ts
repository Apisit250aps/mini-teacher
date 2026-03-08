import z from 'zod'

export const checkStatusSchema = z.enum([
  'DEFAULT',
  'PRESENT',
  'ABSENT',
  'LATE',
  'LEAVE',
])

export const assignTypeSchema = z.enum([
  'ASSIGNMENT',
  'HOMEWORK',
  'QUIZ',
  'EXAM',
  'PROJECT',
])
