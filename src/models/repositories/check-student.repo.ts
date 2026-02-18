import { checkStudentsCollection } from '@/lib/mongo'
import { CheckStudent } from '../entities'
import { omit } from 'lodash'

export async function createCheckStudent(
  data: CheckStudent,
): Promise<CheckStudent> {
  const check_students = await checkStudentsCollection()
  const result = await check_students.insertOne(data)
  if (!result.acknowledged) {
    throw new Error('Failed to create check student')
  }
  return data
}

export async function updateCheckStudent(
  id: string,
  data: Partial<CheckStudent>,
): Promise<CheckStudent> {
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
}

export async function deleteCheckStudent(id: string): Promise<void> {
  const check_students = await checkStudentsCollection()
  const result = await check_students.deleteOne({ id })
  if (result.deletedCount === 0) {
    throw new Error('Failed to delete check student')
  }
}

export async function getUniqueCheckStudent(
  checkDateId: string,
  studentId: string,
): Promise<CheckStudent | null> {
  const check_students = await checkStudentsCollection()
  const [result] = await check_students
    .aggregate<CheckStudent>([
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
}

export async function getCheckStudentById(
  id: string,
): Promise<CheckStudent | null> {
  const check_students = await checkStudentsCollection()
  const [result] = await check_students
    .aggregate<CheckStudent>([
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
}
