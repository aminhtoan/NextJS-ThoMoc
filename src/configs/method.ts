export const METHOD_COLUMNS = [
  { key: 'ALL', label: 'ALL' },
  { key: 'GET', label: 'VIEW' },
  { key: 'POST', label: 'CREATE' },
  { key: 'PUT', label: 'UPDATE' },
  { key: 'DELETE', label: 'DELETE' }
] as const

export const METHOD_MAP = {
  "GET": 'READ',
  "POST": 'CREATE',
  "PUT": 'UPDATE',
  "DELETE": 'DELETE',
  "PATCH": 'UPDATE'
} as const

export type MethodKey = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
export const METHOD_KEYS: MethodKey[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']