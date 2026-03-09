import type { FindManyOptions } from '@/core/domain/data'

export function selectData<T>(res: unknown, fallback: T): T {
  return ((res as { data?: T } | undefined)?.data ?? fallback) as T
}

export function toFilterQuery<TWhere extends object>(
  filter?: FindManyOptions<TWhere>,
): { filter: string } | undefined {
  if (!filter) {
    return undefined
  }

  return {
    filter: JSON.stringify(filter),
  }
}
