import { scoreAssignsCollection } from '@/lib/mongo'
import type { ScoreAssign } from '@/models/domain'
import { ScoreAssignRepository } from '@/models/repositories/interface'

const scoreAssignRepository: ScoreAssignRepository = {
  create: async (data) => {
    const collection = await scoreAssignsCollection()
    await collection.insertOne(data)
    return data
  },

  update: async (id, data) => {
    const collection = await scoreAssignsCollection()
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: data },
      { returnDocument: 'after' },
    )
    return result
  },

  delete: async (id) => {
    const collection = await scoreAssignsCollection()
    const result = await collection.deleteOne({ id })
    if (result.deletedCount === 0) {
      throw new Error('Score assign not found')
    }
    return true
  },

  getById: async (id) => {
    const collection = await scoreAssignsCollection()
    const data = await collection
      .aggregate<ScoreAssign>([
        { $match: { id } },
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

  getByClassId: async (classId) => {
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
}

export default scoreAssignRepository
