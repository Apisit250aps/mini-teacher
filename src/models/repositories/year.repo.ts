import { yearsCollection } from '@/lib/mongo'
import { Year } from '@/models/entities'
import { v7 as uuidv7 } from 'uuid'

export async function createYear(year: Year): Promise<Year> {
  const yearsCol = await yearsCollection()
  await yearsCol.insertOne(year)
  return year
}

export async function initYear(userId: string) {
  const years = await getYearsByAuthUser(userId)
  if (years.length === 0) {
    await createYear({
      id: uuidv7(),
      user: userId,
      year: new Date().getFullYear() + 543,
      term: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    })
  }
}

export async function updateYear(
  id: string,
  update: Partial<Year>,
): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  const result = await yearsCol.findOneAndUpdate(
    { id },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return result
}

export async function getYearById(id: string): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  return yearsCol.findOne({ id }, { projection: { _id: 0 } })
}

export async function getYearActive(): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  return yearsCol.findOne({ isActive: true }, { projection: { _id: 0 } })
}

export async function getYearsByAuthUser(userId: string): Promise<Year[]> {
  const yearsCol = await yearsCollection()
  return yearsCol.find({ user: userId }, { projection: { _id: 0 } }).toArray()
}

export async function deleteYear(id: string): Promise<boolean> {
  const yearsCol = await yearsCollection()
  const result = await yearsCol.deleteOne({ id })
  return result.deletedCount === 1
}

export async function authDeleteYear(
  id: string,
  userId: string,
): Promise<boolean> {
  const yearsCol = await yearsCollection()
  const result = await yearsCol.deleteOne({ id, user: userId })
  return result.deletedCount === 1
}

export async function authGetYearById(
  id: string,
  userId: string,
): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  return yearsCol.findOne({ id, user: userId }, { projection: { _id: 0 } })
}

export async function authGetAllYears(userId: string): Promise<Year[]> {
  const yearsCol = await yearsCollection()
  return yearsCol.find({ user: userId }, { projection: { _id: 0 } }).toArray()
}

export async function authUpdateYear(
  id: string,
  userId: string,
  update: Partial<Year>,
): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  const result = await yearsCol.findOneAndUpdate(
    { id, user: userId },
    { $set: update },
    { returnDocument: 'after', projection: { _id: 0 } },
  )
  return result
}

export async function authCreateYear(year: Year): Promise<Year> {
  const yearsCol = await yearsCollection()
  await yearsCol.insertOne(year)
  return year
}

export async function authSetActiveYear(
  userId: string,
  yearId: string,
): Promise<void> {
  const yearsCol = await yearsCollection()
  await yearsCol.updateMany({ user: userId }, { $set: { isActive: false } })
  await yearsCol.updateOne(
    { id: yearId, user: userId },
    { $set: { isActive: true } },
  )
}

export async function getUniqYear(
  userId: string,
  year: number,
  term: number,
): Promise<Year | null> {
  const yearsCol = await yearsCollection()
  return yearsCol.findOne(
    { user: userId, year, term },
    { projection: { _id: 0 } },
  )
}
