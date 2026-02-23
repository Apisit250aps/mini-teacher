import { scoreStudentsCollection } from '@/lib/mongo'
import type { ScoreStudent, ScoreStudentRepository } from '@/models/domain'

const scoreStudentRepository: ScoreStudentRepository = {
  createScoreStudent: async (data) => {
    const collection = await scoreStudentsCollection()
    await collection.insertOne(data)
    return data
  },

  updateScoreStudent: async (id, score) => {
    const collection = await scoreStudentsCollection()
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: { score, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return result!
  },

  getUniqueScoreStudent: async (scoreAssignId, studentId) => {
    const collection = await scoreStudentsCollection()
    const result = await collection.findOne(
      { scoreAssignId, studentId },
      { projection: { _id: 0 } },
    )
    return result
  },

  getScoreStudentsByAssignId: async (scoreAssignId) => {
    const collection = await scoreStudentsCollection()
    const data = await collection
      .aggregate<ScoreStudent>([
        { $match: { scoreAssignId } },
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'id',
            as: 'student',
            pipeline: [
              {
                $project: {
                  _id: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$student' },
      ])
      .toArray()
    return data
  },
}

// Named exports for backward compatibility
export const createScoreStudent = scoreStudentRepository.createScoreStudent
export const updateScoreStudent = scoreStudentRepository.updateScoreStudent
export const getUniqueScoreStudent = scoreStudentRepository.getUniqueScoreStudent
export const getScoreStudentsByAssignId = scoreStudentRepository.getScoreStudentsByAssignId

export default scoreStudentRepository
