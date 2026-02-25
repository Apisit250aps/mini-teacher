import { classesCollection } from '@/lib/mongo'
import type { Class, ClassRepository } from '@/models/domain'
import { omit } from 'lodash'

const classRepository: ClassRepository = {
  createClass: async (newClass) => {
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

  updateClass: async (id, updatedClass) => {
    try {
      const classes = await classesCollection()
      const result = await classes.findOneAndUpdate(
        { id },
        { $set: omit(updatedClass, ['id']) },
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

  deleteClass: async (id) => {
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

  getClassById: async (id) => {
    try {
      const classes = await classesCollection()
      const result = await classes.findOne({ id }, { projection: { _id: 0 } })
      return result as Class | null
    } catch (error) {
      throw error
    }
  },

  getClassesByYear: async (yearId) => {
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

  getClassByYearAndClassId: async (yearId, classId) => {
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

// Named exports for backward compatibility
export const createClass = classRepository.createClass
export const updateClass = classRepository.updateClass
export const deleteClass = classRepository.deleteClass
export const getClassById = classRepository.getClassById
export const getClassesByYear = classRepository.getClassesByYear
export const getClassByYearAndClassId = classRepository.getClassByYearAndClassId

export default classRepository
