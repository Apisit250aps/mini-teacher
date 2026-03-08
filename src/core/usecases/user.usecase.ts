import type { UserCreateData, UserUpdateData } from '@/core/domain/data/user'
import type { UserRepository } from '@/core/domain/repositories/user'
import type { UserUseCase } from '@/core/domain/usecases/user'
import {
  userCreateSchema,
  userUpdateSchema,
} from '@/core/domain/schema/user.schema'
import { AppError } from '@/lib/utils/error'
import { ensureFoundOrThrow, parseOrThrow, parseUuidOrThrow } from './_shared'

export const createUserUseCase = (repository: UserRepository): UserUseCase => ({
  create: async (data) => {
    const payload = parseOrThrow<UserCreateData>(userCreateSchema, data)

    if (payload.email) {
      const existed = await repository.getByEmail(payload.email)
      if (existed) {
        throw new AppError('อีเมลนี้ถูกใช้งานแล้ว', 'DATA_EXIST')
      }
    }

    return repository.create(payload)
  },

  update: async (id, data) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบผู้ใช้ที่ต้องการแก้ไข',
    )

    const payload = parseOrThrow<UserUpdateData>(userUpdateSchema, data)

    if (payload.email) {
      const existed = await repository.getByEmail(payload.email)
      if (existed && existed.id !== parsedId) {
        throw new AppError('อีเมลนี้ถูกใช้งานแล้ว', 'DATA_EXIST')
      }
    }

    return repository.update(parsedId, payload)
  },

  delete: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    ensureFoundOrThrow(
      await repository.getById(parsedId),
      'ไม่พบผู้ใช้ที่ต้องการลบ',
    )
    await repository.delete(parsedId)
  },

  getById: async (id) => {
    const parsedId = parseUuidOrThrow(id)
    return ensureFoundOrThrow(await repository.getById(parsedId), 'ไม่พบผู้ใช้')
  },

  getByEmail: async (email) => {
    const parsedEmail = parseOrThrow(userCreateSchema.shape.email, email)
    if (!parsedEmail) {
      throw new AppError('กรุณาระบุอีเมล', 'VALIDATE_ERROR')
    }
    return ensureFoundOrThrow(
      await repository.getByEmail(parsedEmail),
      'ไม่พบผู้ใช้',
    )
  },
})
