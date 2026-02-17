import z from 'zod'
import { v7 as uuidv7 } from 'uuid'

export const zodAutoUuid = () => z.uuid().default(() => uuidv7())
export const zodUuid = () => z.uuid()
export const zodName = () =>
  z.string().refine((val) => !val.includes(' '), {
    message: 'ห้ามมีเว้นวรรค',
  })
export const zodEmail = () => z.email('รูปแบบอีเมลไม่ถูกต้อง')
export const zodDate = () => z.date('รูปแบบวันที่ไม่ถูกต้อง').or(z.string())
export const zodTimestamp = () =>
  z
    .date()
    .default(() => new Date())
    .or(z.string())

export const zodLocaleDateString = () =>
  z
    .date()
    .or(z.string())
    .transform((date) => {
      const onlyDate = new Date(date)
      return onlyDate.toLocaleDateString()
    })
