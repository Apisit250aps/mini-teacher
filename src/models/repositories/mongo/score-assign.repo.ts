import { scoreAssignsCollection } from '@/lib/mongo'
import type { ScoreAssign, ScoreAssignRepository } from '@/models/domain'
import { omit } from 'lodash'

const scoreAssignRepository: ScoreAssignRepository = {
  createScoreAssign: async (data) => {
    const collection = await scoreAssignsCollection()
    await collection.insertOne(data)
    return data
  },

  updateScoreAssign: async (assignId, data) => {
    const collection = await scoreAssignsCollection()
    const result = await collection.findOneAndUpdate(
      { id: assignId },
      { $set: omit(data, 'id') },
      { returnDocument: 'after' },
    )
    return result
  },

  deleteScoreAssign: async (assignId) => {
    const collection = await scoreAssignsCollection()
    const result = await collection.deleteOne({ id: assignId })
    if (result.deletedCount === 0) {
      throw new Error('Score assign not found')
    }
    return true
  },

  getScoreAssignsByClassId: async (classId) => {
    const collection = await scoreAssignsCollection()
    const data = await collection
      .aggregate<ScoreAssign>([
        { $match: { classId } },
        {
          $lookup: {
            from: 'score_students',
            let: { scoreAssignId: '$id' },
            as: 'scores',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$scoreAssignId', '$$scoreAssignId'] },
                      { $eq: ['$assignId', '$$scoreAssignId'] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
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
            ],
          },
        },
        { $sort: { createdAt: 1 } },
      ])
      .toArray()
    return data
  },

  getScoreAssignById: async (classId, assignId) => {
    const collection = await scoreAssignsCollection()
    const data = await collection
      .aggregate<ScoreAssign>([
        { $match: { classId, id: assignId } },
        {
          $lookup: {
            from: 'score_students',
            let: { scoreAssignId: '$id' },
            as: 'scores',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$scoreAssignId', '$$scoreAssignId'] },
                      { $eq: ['$assignId', '$$scoreAssignId'] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
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
            ],
          },
        },
      ])
      .toArray()

    return data[0] ?? null
  },
}

// Named exports for backward compatibility
export const createScoreAssign = scoreAssignRepository.createScoreAssign
export const updateScoreAssign = scoreAssignRepository.updateScoreAssign
export const deleteScoreAssign = scoreAssignRepository.deleteScoreAssign
export const getScoreAssignsByClassId = scoreAssignRepository.getScoreAssignsByClassId
export const getScoreAssignById = scoreAssignRepository.getScoreAssignById

export default scoreAssignRepository
