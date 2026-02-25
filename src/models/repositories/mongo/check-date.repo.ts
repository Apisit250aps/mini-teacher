import { checkDatesCollection } from '@/lib/mongo'
import type { CheckDate } from '@/models/domain'
import { omit } from 'lodash'
import { CheckDateRepository } from '../interface/check-date.repository';

const checkDateRepository: CheckDateRepository = {
  createCheckDate: async (checkDate) => {
    const check_dates = await checkDatesCollection()
    const result = await check_dates.insertOne(checkDate)
    if (!result.acknowledged) {
      throw new Error('Failed to create check date')
    }
    return checkDate
  },

  updateCheckDate: async (id, checkDate) => {
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
  },

  deleteCheckDate: async (id) => {
    const check_dates = await checkDatesCollection()
    const result = await check_dates.deleteOne({ id })
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete check date')
    }
  },

  getCheckDateById: async (id) => {
    const check_dates = await checkDatesCollection()
    const result = await check_dates.findOne({ id }, { projection: { _id: 0 } })
    if (!result) {
      throw new Error('Check date not found')
    }
    return result
  },

  getCheckDatesByClassId: async (classId) => {
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
  },
}

// Named exports for backward compatibility
export const createCheckDate = checkDateRepository.createCheckDate
export const updateCheckDate = checkDateRepository.updateCheckDate
export const deleteCheckDate = checkDateRepository.deleteCheckDate
export const getCheckDateById = checkDateRepository.getCheckDateById
export const getCheckDatesByClassId = checkDateRepository.getCheckDatesByClassId

export default checkDateRepository
