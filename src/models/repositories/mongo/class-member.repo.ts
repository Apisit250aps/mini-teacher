import { classMembersCollection } from '@/lib/mongo'
import type { ClassMemberDetail } from '@/models/domain'
import { ClassMemberRepository } from '@/models/repositories/interface'

const classMemberRepository: ClassMemberRepository = {
  create: async (classMember) => {
    const collection = await classMembersCollection()
    await collection.insertOne(classMember)
    return classMember
  },

  delete: async (id) => {
    const collection = await classMembersCollection()
    await collection.deleteOne({ id })
  },

  getUnique: async (classId, studentId) => {
    const collection = await classMembersCollection()
    const member = await collection.findOne(
      { classId, studentId },
      { projection: { _id: 0 } },
    )
    return member
  },

  getByClassId: async (classId) => {
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
  },
}

export default classMemberRepository
