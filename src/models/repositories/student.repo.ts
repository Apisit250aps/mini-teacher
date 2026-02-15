import { studentsCollection } from '@/lib/mongo'
import { Student } from '@/models/entities'
import { omit } from 'lodash';

export async function createStudent(data: Student): Promise<Student> {
  const collection = await studentsCollection()
  await collection.insertOne(data)
  return data
}

export async function teacherCreateStudent(data: Student): Promise<Student> {
  const collection = await studentsCollection()
  await collection.insertOne(data)
  return data
}

export async function updateStudent(
  id: string,
  data: Partial<Student>,
): Promise<Student | null> {
  const collection = await studentsCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: data },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return result
}

export async function teacherUpdateStudent(
  id: string,
  data: Partial<Student>,
): Promise<Student | null> {
  const collection = await studentsCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: omit(data, ['id', 'teacher']) },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return result
}

export async function getStudentById(id: string): Promise<Student | null> {
  const collection = await studentsCollection()
  const student = await collection.findOne({ id }, { projection: { _id: 0 } })
  return student
}

export async function getAllStudent(teacherId: string): Promise<Student[]> {
  const collection = await studentsCollection()
  const students = await collection
    .find({ teacher: teacherId }, { projection: { _id: 0 }, sort: { code: 1 } })
    .toArray()
  return students
}

export async function teacherGetAllStudent(
  teacherId: string,
): Promise<Student[]> {
  const collection = await studentsCollection()
  const students = await collection
    .find({ teacher: teacherId }, { projection: { _id: 0 }, sort: { code: 1 } })
    .toArray()
  return students
}

export async function deleteStudent(id: string): Promise<void> {
  const collection = await studentsCollection()
  await collection.deleteOne({ id })
}

export async function teacherDeleteStudent(
  id: string,
  teacherId: string,
): Promise<void> {
  const collection = await studentsCollection()
  await collection.deleteOne({ id, teacher: teacherId })
}
