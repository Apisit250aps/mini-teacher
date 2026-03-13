import z from 'zod'

export const checkStatus = [
  'DEFAULT',
  'PRESENT',
  'ABSENT',
  'LATE',
  'LEAVE',
] as const
export const assignType = [
  'ASSIGNMENT',
  'HOMEWORK',
  'QUIZ',
  'EXAM',
  'PROJECT',
] as const

export const checkStatusSchema = z.enum(checkStatus)
export const assignTypeSchema = z.enum(assignType)

export const documentType = ['TOS', 'PRIVACY_POLICY'] as const
export const documentTypeSchema = z.enum(documentType)

export const documentLanguage = ['EN', 'TH'] as const
export const documentLanguageSchema = z.enum(documentLanguage)
