import { usersCollection } from '@/lib/mongo'
import { hash } from '@/lib/utils/encryption'
import { User } from '@/models/entities'
import { isNil, omit, omitBy } from 'lodash'

export async function createUser(user: User): Promise<User | null> {
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
    return null
  } catch (error) {
    throw error
  }
}

export async function updateUser(
  id: string,
  user: Partial<User>,
): Promise<User | null> {
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
}

export async function deleteUser(id: string) {
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
}

export async function findUserByName(name: string): Promise<User | null> {
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
}

export async function findUserById(id: string): Promise<User | null> {
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
}
