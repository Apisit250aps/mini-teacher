import { yearsCollection } from '@/lib/mongo'
import { Year } from '@/models/entities'
import { v7 as uuidv7 } from 'uuid';


export async function createYear(year: Year): Promise<Year> {
  const yearsCol = await yearsCollection()
  await yearsCol.insertOne(year)
  return year
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

export async function getYearsByAuthUser(userId: string): Promise<Year[]> {
  const yearsCol = await yearsCollection()
  return yearsCol.find({ user: userId }, { projection: { _id: 0 } }).toArray()
}

export async function deleteYear(id: string): Promise<boolean> {
  const yearsCol = await yearsCollection()
  const result = await yearsCol.deleteOne({ id })
  return result.deletedCount === 1
}

export async function initYear(userId: string) {
  const years = await getYearsByAuthUser(userId)
  if (years.length === 0) {
    await createYear({
      id: uuidv7(),
      user: userId,
      year: new Date().getFullYear(),
      term: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    })
  }
}
