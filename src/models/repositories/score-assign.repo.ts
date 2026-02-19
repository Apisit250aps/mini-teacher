import { scoreAssignsCollection } from '@/lib/mongo'
import { ScoreAssign } from '../entities'

export async function createScoreAssign(
  data: ScoreAssign,
): Promise<ScoreAssign> {
  const collection = await scoreAssignsCollection()
  await collection.insertOne(data)
  return data
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
