import { classMembersCollection } from '@/lib/mongo'
import type {
  ClassMemberDetail,
  ClassMemberRepository,
} from '@/models/domain'

const classMemberRepository: ClassMemberRepository = {
  addClassMember: async (classMember) => {
    const collection = await classMembersCollection()
    await collection.insertOne(classMember)
    return classMember
  },

  deleteClassMember: async (classId, studentId) => {
    const collection = await classMembersCollection()
    await collection.deleteOne({ classId, studentId })
  },

  getUniqMember: async (classId, studentId) => {
    const collection = await classMembersCollection()
    const member = await collection.findOne(
      { classId, studentId },
      { projection: { _id: 0 } },
    )
    return member
  },

  getClassMembersByClassId: async (classId) => {
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

// Named exports for backward compatibility
export const addClassMember = classMemberRepository.addClassMember
export const deleteClassMember = classMemberRepository.deleteClassMember
export const getUniqMember = classMemberRepository.getUniqMember
export const getClassMembersByClassId = classMemberRepository.getClassMembersByClassId

export default classMemberRepository
