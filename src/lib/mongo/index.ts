import type { Collection } from 'mongodb'
import { User } from '@/models/entities'
import { connect } from '@/lib/mongo/client'
import { Year } from '@/models/entities/year.entity';

let _users: Collection<User> | null = null
let _years: Collection<Year> | null = null

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
    ])
  }
  return _years
}

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
