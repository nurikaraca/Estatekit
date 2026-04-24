type QueryResult<TValue> = Promise<{ data: TValue; error: { message: string } | null }>

export function createResolvedQuery<TValue>(data: TValue, error: { message: string } | null = null) {
  const result = Promise.resolve({ data, error })

  return {
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => result),
        maybeSingle: jest.fn(() => result),
        neq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              limit: jest.fn(() => result),
            })),
          })),
        })),
      })),
      order: jest.fn(() => result),
    })),
  }
}

export function resolvedResult<TValue>(data: TValue, error: { message: string } | null = null): QueryResult<TValue> {
  return Promise.resolve({ data, error })
}
