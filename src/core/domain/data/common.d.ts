export type SortOrder = 'asc' | 'desc'

export type QueryWhere<T extends object> = Partial<T> & Record<string, unknown>

export interface FindManyOptions<
  TWhere extends object = Record<string, unknown>,
> {
  where?: QueryWhere<TWhere>
  orderBy?: Record<string, SortOrder> | Array<Record<string, SortOrder>>
  skip?: number
  take?: number
}
