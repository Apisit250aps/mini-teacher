import z from 'zod'
import { v7 as uuidv7 } from 'uuid'

export const zodUuid = () => z.uuid().default(() => uuidv7())
export const zodName = () =>
  z.string().refine((val) => !val.includes(' '), {
    message: 'ห้ามมีเว้นวรรค',
  })
export const zodEmail = () => z.email('รูปแบบอีเมลไม่ถูกต้อง')
export const zodDate = () => z.date('รูปแบบวันที่ไม่ถูกต้อง')
export const zodTimestamp = () => z.date().default(() => new Date())
