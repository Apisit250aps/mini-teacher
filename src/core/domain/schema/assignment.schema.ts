import z from 'zod'
import { assignTypeSchema } from './enums'
import {
  dateSchema,
  ensureAtLeastOneField,
  optionalNullableStringSchema,
  uuidSchema,
} from './common'

export const assignmentEntitySchema = z
  .object({
    id: uuidSchema,
    classId: uuidSchema,
    title: z.string().trim().min(1),
    description: optionalNullableStringSchema,
    minScore: z.number().int().min(0),
    maxScore: z.number().int().min(0),
    type: assignTypeSchema,
    assignDate: dateSchema.nullable().optional(),
    dueDate: dateSchema.nullable().optional(),
    isEditable: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .refine((value) => value.maxScore >= value.minScore, {
    message: 'maxScore ต้องมากกว่าหรือเท่ากับ minScore',
    path: ['maxScore'],
  })

export const assignmentCreateSchema = assignmentEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const assignmentUpdateSchema = assignmentCreateSchema
  .partial()
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })
