import { scoreStudentsCollection } from '@/lib/mongo'
import { ScoreStudent } from '@/models/entities'

export async function createScoreStudent(
  data: ScoreStudent,
): Promise<ScoreStudent> {
  const collection = await scoreStudentsCollection()
  await collection.insertOne(data)
  return data
}

export async function updateScoreStudent(
  id: string,
  score: number,
): Promise<ScoreStudent> {
  const collection = await scoreStudentsCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: { score, updatedAt: new Date() } },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return result!
}

export async function getUniqueScoreStudent(
  scoreAssignId: string,
  studentId: string,
): Promise<ScoreStudent | null> {
  const collection = await scoreStudentsCollection()
  const result = await collection.findOne(
    { scoreAssignId, studentId },
    { projection: { _id: 0 } },
  )
  return result
}

export async function getScoreStudentsByAssignId(
  scoreAssignId: string,
): Promise<ScoreStudent[]> {
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
}
