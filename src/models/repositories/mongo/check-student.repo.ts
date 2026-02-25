import { checkStudentsCollection } from '@/lib/mongo'
import type { CheckStudentDetail } from '@/models/domain'
import { omit } from 'lodash'
import { CheckStudentRepository } from '../interface/check-student.repository'

const checkStudentRepository: CheckStudentRepository = {
  create: async (data) => {
    const check_students = await checkStudentsCollection()
    const result = await check_students.insertOne(data)
    if (!result.acknowledged) {
      throw new Error('Failed to create check student')
    }
    return data
  },

  update: async (id, data) => {
    const check_students = await checkStudentsCollection()
    const result = await check_students.findOneAndUpdate(
      { id },
      { $set: omit(data, ['id', 'createdAt']) },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    if (!result) {
      throw new Error('Failed to update check student')
    }
    return result
  },

  delete: async (id) => {
    const check_students = await checkStudentsCollection()
    const result = await check_students.deleteOne({ id })
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete check student')
    }
  },

  getUnique: async (checkDateId, studentId) => {
    const check_students = await checkStudentsCollection()
    const [result] = await check_students
      .aggregate<CheckStudentDetail>([
        { $match: { checkDateId, studentId } },
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'id',
            as: 'student',
            pipeline: [{ $project: { _id: 0 } }],
          },
        },
        { $unwind: '$student' },
        { $project: { _id: 0 } },
      ])
      .toArray()
    return result || null
  },

  getById: async (id) => {
    const check_students = await checkStudentsCollection()
    const [result] = await check_students
      .aggregate<CheckStudentDetail>([
        { $match: { id } },
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'id',
            as: 'student',
            pipeline: [{ $project: { _id: 0 } }],
          },
        },
        { $unwind: '$student' },
        { $project: { _id: 0 } },
      ])
      .toArray()

    return result || null
  },
}

export default checkStudentRepository
