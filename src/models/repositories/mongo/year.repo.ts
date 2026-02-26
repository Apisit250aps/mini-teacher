import { yearsCollection } from '@/lib/mongo'
import type { YearDetail } from '@/models/domain'
import { YearRepository } from '@/models/repositories/interface/year.repository';
import { v7 as uuidv7 } from 'uuid'

const yearRepository: YearRepository = {
  createYear: async (year) => {
    const yearsCol = await yearsCollection()
    await yearsCol.insertOne(year)
    return year
  },

  initYear: async (userId) => {
    const years = await yearRepository.getYearsByAuthUser(userId)
    if (years.length === 0) {
      await yearRepository.createYear({
        id: uuidv7(),
        user: userId,
        year: new Date().getFullYear() + 543,
        term: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      })
    }
  },

  updateYear: async (id, update) => {
    const yearsCol = await yearsCollection()
    const result = await yearsCol.findOneAndUpdate(
      { id },
      { $set: update },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return result
  },

  getYearById: async (id) => {
    const yearsCol = await yearsCollection()
    return yearsCol.findOne({ id }, { projection: { _id: 0 } })
  },

  getYearActive: async () => {
    const yearsCol = await yearsCollection()
    return yearsCol.findOne({ isActive: true }, { projection: { _id: 0 } })
  },

  getYearsByAuthUser: async (userId) => {
    const yearsCol = await yearsCollection()
    return yearsCol.find({ user: userId }, { projection: { _id: 0 } }).toArray()
  },

  getYearsByYearTerm: async (year, term, user) => {
    const yearsCol = await yearsCollection()
    return yearsCol.findOne({ year, term, user }, { projection: { _id: 0 } })
  },

  deleteYear: async (id) => {
    const yearsCol = await yearsCollection()
    const result = await yearsCol.deleteOne({ id })
    return result.deletedCount === 1
  },

  authDeleteYear: async (id, userId) => {
    const yearsCol = await yearsCollection()
    const result = await yearsCol.deleteOne({ id, user: userId })
    return result.deletedCount === 1
  },

  authGetYearById: async (id, userId) => {
    const yearsCol = await yearsCollection()
    return yearsCol.findOne({ id, user: userId }, { projection: { _id: 0 } })
  },

  authGetAllYears: async (userId) => {
    const yearsCol = await yearsCollection()
    const result = await yearsCol
      .aggregate<YearDetail>([
        { $match: { user: userId } },
        {
          $lookup: {
            from: 'classes',
            localField: 'id',
            foreignField: 'year',
            as: 'classes',
            pipeline: [{ $project: { _id: 0 } }],
          },
        },
        { $project: { _id: 0 } },
      ])
      .toArray()
    return result
  },

  authUpdateYear: async (id, userId, update) => {
    const yearsCol = await yearsCollection()
    const result = await yearsCol.findOneAndUpdate(
      { id, user: userId },
      { $set: update },
      { returnDocument: 'after', projection: { _id: 0 } },
    )
    return result
  },

  authCreateYear: async (year) => {
    const yearsCol = await yearsCollection()
    await yearsCol.insertOne(year)
    return year
  },

  authSetActiveYear: async (userId, yearId) => {
    const yearsCol = await yearsCollection()
    await yearsCol.updateMany({ user: userId }, { $set: { isActive: false } })
    await yearsCol.updateOne(
      { id: yearId, user: userId },
      { $set: { isActive: true } },
    )
  },

  getUniqYear: async (userId, year, term) => {
    const yearsCol = await yearsCollection()
    return yearsCol.findOne(
      { user: userId, year, term },
      { projection: { _id: 0 } },
    )
  },
}

// Named exports for backward compatibility
export const createYear = yearRepository.createYear
export const initYear = yearRepository.initYear
export const updateYear = yearRepository.updateYear
export const getYearById = yearRepository.getYearById
export const getYearActive = yearRepository.getYearActive
export const getYearsByAuthUser = yearRepository.getYearsByAuthUser
export const getYearsByYearTerm = yearRepository.getYearsByYearTerm
export const deleteYear = yearRepository.deleteYear
export const authDeleteYear = yearRepository.authDeleteYear
export const authGetYearById = yearRepository.authGetYearById
export const authGetAllYears = yearRepository.authGetAllYears
export const authUpdateYear = yearRepository.authUpdateYear
export const authCreateYear = yearRepository.authCreateYear
export const authSetActiveYear = yearRepository.authSetActiveYear
export const getUniqYear = yearRepository.getUniqYear

export default yearRepository
