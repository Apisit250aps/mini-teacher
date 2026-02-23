import { studentsCollection } from '@/lib/mongo'
import type { StudentRepository } from '@/models/domain'
import { omit } from 'lodash'

const studentRepository: StudentRepository = {
  createStudent: async (data) => {
    const collection = await studentsCollection()
    await collection.insertOne(data)
    return data
  },

  teacherCreateStudent: async (data) => {
    const collection = await studentsCollection()
    await collection.insertOne(data)
    return data
  },

  updateStudent: async (id, data) => {
    const collection = await studentsCollection()
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: data },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return result
  },

  teacherUpdateStudent: async (id, data) => {
    const collection = await studentsCollection()
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: omit(data, ['id', 'teacher']) },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return result
  },

  getStudentById: async (id) => {
    const collection = await studentsCollection()
    const student = await collection.findOne({ id }, { projection: { _id: 0 } })
    return student
  },

  getAllStudent: async (teacherId) => {
    const collection = await studentsCollection()
    const students = await collection
      .find({ teacher: teacherId }, { projection: { _id: 0 }, sort: { code: 1 } })
      .toArray()
    return students
  },

  teacherGetAllStudent: async (teacherId) => {
    const collection = await studentsCollection()
    const students = await collection
      .find({ teacher: teacherId }, { projection: { _id: 0 }, sort: { code: 1 } })
      .toArray()
    return students
  },

  deleteStudent: async (id) => {
    const collection = await studentsCollection()
    await collection.deleteOne({ id })
  },

  teacherDeleteStudent: async (id, teacherId) => {
    const collection = await studentsCollection()
    await collection.deleteOne({ id, teacher: teacherId })
  },
}

// Named exports for backward compatibility
export const createStudent = studentRepository.createStudent
export const teacherCreateStudent = studentRepository.teacherCreateStudent
export const updateStudent = studentRepository.updateStudent
export const teacherUpdateStudent = studentRepository.teacherUpdateStudent
export const getStudentById = studentRepository.getStudentById
export const getAllStudent = studentRepository.getAllStudent
export const teacherGetAllStudent = studentRepository.teacherGetAllStudent
export const deleteStudent = studentRepository.deleteStudent
export const teacherDeleteStudent = studentRepository.teacherDeleteStudent

export default studentRepository
