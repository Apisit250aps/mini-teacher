import { classMembersCollection } from '@/lib/mongo'
import { ClassMember, ClassMemberDetail } from '@/models/entities'

export async function addClassMember(
  classMember: ClassMember,
): Promise<ClassMember> {
  const collection = await classMembersCollection()
  await collection.insertOne(classMember)
  return classMember
}

export async function deleteClassMember(
  classId: string,
  studentId: string,
): Promise<void> {
  const collection = await classMembersCollection()
  await collection.deleteOne({ classId, studentId })
}

export async function getClassMembersByClassId(
  classId: string,
): Promise<ClassMemberDetail[]> {
  const member = await classMembersCollection()
  const data = await member
    .aggregate<ClassMemberDetail>([
      { $match: { classId } },
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
      {
        $project: {
          _id: 0,
        },
      },
      { $unwind: '$student' },
    ])
    .toArray()

  return data
}
