import { checkDatesCollection } from '@/lib/mongo'
import { CheckDate } from '@/models/entities'
import { omit } from 'lodash'

export async function createCheckDate(
  checkDate: CheckDate,
): Promise<CheckDate> {
  const check_dates = await checkDatesCollection()
  const result = await check_dates.insertOne(checkDate)
  if (!result.acknowledged) {
    throw new Error('Failed to create check date')
  }
  return checkDate
}

export async function updateCheckDate(
  id: string,
  checkDate: Partial<CheckDate>,
): Promise<CheckDate> {
  const check_dates = await checkDatesCollection()
  const update = await check_dates.findOneAndUpdate(
    { id },
    { $set: omit(checkDate, ['id', 'createdAt']) },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  if (!update) {
    throw new Error('Failed to update check date')
  }
  return update
}

export async function deleteCheckDate(id: string): Promise<void> {
  const check_dates = await checkDatesCollection()
  const result = await check_dates.deleteOne({ id })
  if (result.deletedCount === 0) {
    throw new Error('Failed to delete check date')
  }
}

export async function getCheckDateById(id: string): Promise<CheckDate | null> {
  const check_dates = await checkDatesCollection()
  return await check_dates.findOne({ id }, { projection: { _id: 0 } })
}

export async function getCheckDatesByClassId(
  classId: string,
): Promise<CheckDate[]> {
  const check_dates = await checkDatesCollection()
  const checked = await check_dates
    .aggregate<CheckDate>([
      { $match: { classId } },
      { $sort: { date: 1 } },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: 'check_students',
          localField: 'id',
          foreignField: 'checkDateId',
          as: 'checkStudents',
          pipeline: [{ $project: { _id: 0 } }],
        },
      },
    ])
    .toArray()
  return checked
}
