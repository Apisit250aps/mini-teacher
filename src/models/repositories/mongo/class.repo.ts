import { classesCollection } from '@/lib/mongo'
import type { Class } from '@/models/domain'
import { ClassRepository } from '@/models/repositories/interface'

const classRepository: ClassRepository = {
  create: async (newClass) => {
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
  },

  update: async (id, data) => {
    try {
      const classes = await classesCollection()
      const result = await classes.findOneAndUpdate(
        { id },
        { $set: data },
        { returnDocument: 'after', projection: { _id: 0 } },
      )
      if (!result) {
        throw new Error('Failed to update class')
      }
      return result as Class
    } catch (error) {
      throw error
    }
  },

  delete: async (id) => {
    try {
      const classes = await classesCollection()
      const result = await classes.deleteOne({ id })
      if (result.deletedCount === 0) {
        throw new Error('Failed to delete class')
      }
    } catch (error) {
      throw error
    }
  },

  getById: async (id) => {
    try {
      const classes = await classesCollection()
      const result = await classes.findOne({ id }, { projection: { _id: 0 } })
      return result as Class | null
    } catch (error) {
      throw error
    }
  },

  getByYearId: async (yearId) => {
    try {
      const classes = await classesCollection()
      const result = await classes
        .find({ year: yearId }, { projection: { _id: 0 } })
        .toArray()
      return result as Class[]
    } catch (error) {
      throw error
    }
  },

  getUnique: async (yearId, classId) => {
    try {
      const classes = await classesCollection()
      const result = await classes.findOne(
        { year: yearId, id: classId },
        { projection: { _id: 0 } },
      )
      return result as Class | null
    } catch (error) {
      throw error
    }
  },
}

export default classRepository
