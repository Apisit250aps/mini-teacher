import { classesCollection } from '@/lib/mongo'
import { Class } from '../entities'

export async function createClass(newClass: Class): Promise<Class> {
  try {
    const classes = await classesCollection()
    const result = await classes.insertOne(newClass)
    if (!result.insertedId) {
      throw new Error('Failed to create class')
    }
    return newClass as Class
  } catch (error) {
    throw error
  }
}

export async function updateClass(
  id: string,
  updatedClass: Partial<Class>,
): Promise<Class | null> {
  try {
    const classes = await classesCollection()
    const result = await classes.findOneAndUpdate(
      { id },
      { $set: updatedClass },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    if (!result) {
      throw new Error('Failed to update class')
    }
    return result as Class
  } catch (error) {
    throw error
  }
}

export async function deleteClass(id: string): Promise<void> {
  try {
    const classes = await classesCollection()
    const result = await classes.deleteOne({ id })
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete class')
    }
  } catch (error) {
    throw error
  }
}

export async function getClassById(id: string): Promise<Class | null> {
  try {
    const classes = await classesCollection()
    const result = await classes.findOne({ id }, { projection: { _id: 0 } })
    return result as Class | null
  } catch (error) {
    throw error
  }
}

export async function getClassesByYear(yearId: string): Promise<Class[]> {
  try {
    const classes = await classesCollection()
    const result = await classes
      .find({ year: yearId }, { projection: { _id: 0 } })
      .toArray()
    return result as Class[]
  } catch (error) {
    throw error
  }
}
