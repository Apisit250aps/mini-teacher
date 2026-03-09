type PathSegment = string | number

type DateKeyMatcher = (key: string, path: PathSegment[]) => boolean

type DateValueMatcher = (
  value: unknown,
  key: string,
  path: PathSegment[],
) => boolean

export type MapDatesDeepOptions = {
  keyMatcher?: DateKeyMatcher
  valueMatcher?: DateValueMatcher
  keepInvalidDate?: boolean
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ISO_DATE_TIME_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/

const defaultKeyMatcher: DateKeyMatcher = (key) => {
  const normalized = key.toLowerCase()
  return (
    normalized.endsWith('at') ||
    normalized.includes('date') ||
    normalized === 'expires' ||
    normalized === 'expiry'
  )
}

const defaultValueMatcher: DateValueMatcher = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value)
  }

  if (typeof value !== 'string') {
    return false
  }

  const candidate = value.trim()
  return ISO_DATE_RE.test(candidate) || ISO_DATE_TIME_RE.test(candidate)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function toDate(value: string | number): Date {
  return new Date(value)
}

function mapDatesDeepInternal(
  input: unknown,
  options: Required<MapDatesDeepOptions>,
  path: PathSegment[],
): unknown {
  if (input instanceof Date) {
    return input
  }

  if (Array.isArray(input)) {
    return input.map((item, index) =>
      mapDatesDeepInternal(item, options, [...path, index]),
    )
  }

  if (!isPlainObject(input)) {
    return input
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    const nextPath = [...path, key]

    if (
      options.keyMatcher(key, nextPath) &&
      options.valueMatcher(value, key, nextPath)
    ) {
      if (typeof value !== 'string' && typeof value !== 'number') {
        result[key] = value
        continue
      }

      const parsed = toDate(value)
      result[key] =
        options.keepInvalidDate || !Number.isNaN(parsed.getTime())
          ? parsed
          : value
      continue
    }

    result[key] = mapDatesDeepInternal(value, options, nextPath)
  }

  return result
}

export function mapDatesDeep<T>(input: T, options?: MapDatesDeepOptions): T {
  const normalizedOptions: Required<MapDatesDeepOptions> = {
    keyMatcher: options?.keyMatcher ?? defaultKeyMatcher,
    valueMatcher: options?.valueMatcher ?? defaultValueMatcher,
    keepInvalidDate: options?.keepInvalidDate ?? false,
  }

  return mapDatesDeepInternal(input, normalizedOptions, []) as T
}
