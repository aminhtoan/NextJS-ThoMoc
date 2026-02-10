import { MethodKey } from 'src/configs/method'

export const normaliseMethod = (m: string): MethodKey => {
  const upper = m.toUpperCase()
  if (upper === 'PATCH') return 'PUT'
  if (upper === 'OPTIONS' || upper === 'HEAD') return 'GET'

  return upper as MethodKey
}
