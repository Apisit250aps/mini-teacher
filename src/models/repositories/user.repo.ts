import { usersCollection } from '@/lib/mongo'
import { hash } from '@/lib/utils/encryption'
import type { User, UserRepository } from '@/models/domain'
import { isNil, omit, omitBy } from 'lodash'
import { ObjectId } from 'mongodb'
import { initYear } from './year.repo'

const userRepository: UserRepository = {
  createUser: async (user) => {
    try {
      const users = await usersCollection()
      const encrypted = await hash(user.password)
      const result = await users.insertOne({
        ...user,
        password: encrypted,
      })
      if (result.insertedId) {
        return omit(user, 'password') as User
      }
      await initYear(user.id)
      return null
    } catch (error) {
      throw error
    }
  },

  updateUser: async (id, user) => {
    try {
      const users = await usersCollection()
      const set = omitBy(
        {
          ...user,
          password: user.password ? await hash(user.password) : undefined,
        },
        isNil,
      )
      const result = await users.findOneAndUpdate(
        {
          id,
        },
        {
          $set: set,
        },
        {
          returnDocument: 'after',
          projection: { password: 0, _id: 0 },
        },
      )
      if (!result) {
        throw new Error('Update failed')
      }
      return result
    } catch (error) {
      throw error
    }
  },

  deleteUser: async (id) => {
    try {
      const users = await usersCollection()
      const result = await users.deleteOne({ id })
      if (!result.deletedCount) {
        throw new Error('Delete failed')
      }
      return true
    } catch (error) {
      throw error
    }
  },

  findUserByName: async (name) => {
    try {
      const users = await usersCollection()
      const user = await users.findOne(
        {
          name,
        },
        {
          projection: { password: 0, _id: 0 },
        },
      )
      return user
    } catch (error) {
      throw error
    }
  },

  findUserById: async (id) => {
    try {
      const users = await usersCollection()
      const user = await users.findOne(
        {
          id,
        },
        {
          projection: { password: 0, _id: 0 },
        },
      )
      return user
    } catch (error) {
      throw error
    }
  },

  oAuthCreateUser: async (id, user) => {
    const users = await usersCollection()
    const result = await users.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: user,
      },
      {
        upsert: true,
        returnDocument: 'after',
        projection: { password: 0, _id: 0 },
      },
    )
    if (!result) {
      throw new Error('Create failed')
    }
    await initYear(result.id!)
    return result
  },

  findWithObjectId: async (id) => {
    const users = await usersCollection()
    const user = await users.findOne(
      {
        _id: new ObjectId(id),
      },
      {
        projection: { password: 0, _id: 0 },
      },
    )
    return user
  },
}

// Named exports for backward compatibility
export const createUser = userRepository.createUser
export const updateUser = userRepository.updateUser
export const deleteUser = userRepository.deleteUser
export const findUserByName = userRepository.findUserByName
export const findUserById = userRepository.findUserById
export const oAuthCreateUser = userRepository.oAuthCreateUser
export const findWithObjectId = userRepository.findWithObjectId

export default userRepository
