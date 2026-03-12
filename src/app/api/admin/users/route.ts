import { userUseCase } from '@/core/usecases'
import { toErrorResponse } from '@/lib/utils/error'
import { ok } from '@/lib/utils/server'

export async function GET() {
  try {
    const data = await userUseCase.getAll()
    return ok('ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ', data)
  } catch (error) {
    return toErrorResponse(error)
  }
}
