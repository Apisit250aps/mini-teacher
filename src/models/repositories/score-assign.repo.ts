import { scoreAssignsCollection } from '@/lib/mongo'
import { ScoreAssign } from '../entities'
import { omit } from 'lodash'

export async function createScoreAssign(
  data: ScoreAssign,
): Promise<ScoreAssign> {
  const collection = await scoreAssignsCollection()
  await collection.insertOne(data)
  return data
}

export async function updateScoreAssign(
  assignId: string,
  data: Partial<ScoreAssign>,
): Promise<ScoreAssign | null> {
  const collection = await scoreAssignsCollection()
  const result = await collection.findOneAndUpdate(
    { id: assignId },
    { $set: omit(data, 'id') },
    { returnDocument: 'after' },
  )
  return result
}

export async function deleteScoreAssign(assignId: string): Promise<boolean> {
  const collection = await scoreAssignsCollection()
  const result = await collection.deleteOne({ id: assignId })
  if (result.deletedCount === 0) {
    throw new Error('Score assign not found')
  }
  return true
}

export async function getScoreAssignsByClassId(
  classId: string,
): Promise<ScoreAssign[]> {
  const collection = await scoreAssignsCollection()
  const data = await collection
    .aggregate<ScoreAssign>([
      { $match: { classId } },
      {
        $lookup: {
          from: 'score_students',
          localField: 'id',
          foreignField: 'assignId',
          as: 'scores',
          pipeline: [
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
      { $sort: { createdAt: -1 } },
    ])
    .toArray()
  return data
}

export async function getScoreAssignById(
  classId: string,
  assignId: string,
): Promise<ScoreAssign | null> {
  const collection = await scoreAssignsCollection()
  const data = await collection
    .aggregate<ScoreAssign>([
      { $match: { classId, id: assignId } },
      {
        $lookup: {
          from: 'score_students',
          localField: 'id',
          foreignField: 'assignId',
          as: 'scores',
          pipeline: [
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
}
