import z from 'zod'
import { documentTypeSchema, documentLanguageSchema } from './enums'
import { ensureAtLeastOneField, querySchema } from './common'

export const documentEntitySchema = z.object({
  id: z.string().min(1),
  type: documentTypeSchema,
  version: z.string().trim().min(1, 'กรุณาระบุเวอร์ชัน'),
  content: z.string().min(1, 'กรุณาระบุเนื้อหาเอกสาร'),
  language: documentLanguageSchema.default('TH'),
  isActive: z.boolean(),
  createdAt: z.date(),
})

export const documentCreateSchema = documentEntitySchema.omit({
  id: true,
  createdAt: true,
})

export const documentUpdateSchema = z
  .object({
    content: z.string().min(1, 'กรุณาระบุเนื้อหาเอกสาร').optional(),
    isActive: z.boolean().optional(),
  })
  .refine(ensureAtLeastOneField, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 ฟิลด์',
  })

export const documentQuerySchema = querySchema
