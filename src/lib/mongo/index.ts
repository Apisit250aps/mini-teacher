import type { Collection } from 'mongodb'
import { Class, User } from '@/models/entities'
import { connect } from '@/lib/mongo/client'
import { Year } from '@/models/entities/year.entity'

let _users: Collection<User> | null = null
let _years: Collection<Year> | null = null
let _classes: Collection<Class> | null = null

export async function usersCollection(): Promise<Collection<User>> {
  if (!_users) {
    const db = await connect()
    _users = db.collection<User>('users')
    await _users.createIndexes([
      { key: { name: 1 }, unique: true, name: 'uniq_name' },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
    ])
  }
  return _users
}

export async function yearsCollection(): Promise<Collection<Year>> {
  if (!_years) {
    const db = await connect()
    _years = db.collection<Year>('years')
    await _years.createIndexes([
      {
        key: { user: 1, year: 1, term: 1 },
        unique: true,
        name: 'uniq_user_year_term',
      },
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
      { key: { user: 1 }, name: 'idx_user' },
      { key: { year: 1 }, name: 'idx_year' },
      { key: { term: 1 }, name: 'idx_term' },
    ])
  }
  return _years
}

export async function classesCollection(): Promise<Collection<Class>> {
  if (!_classes) {
    const db = await connect()
    _classes = db.collection<Class>('classes')
    await _classes.createIndexes([
      { key: { id: 1 }, unique: true, name: 'uniq_id' },
      { key: { name: 1 }, name: 'idx_name' },
      { key: { year: 1 }, name: 'idx_year' },
    ])
  }
  return _classes
}
