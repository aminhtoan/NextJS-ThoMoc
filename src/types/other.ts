export const STATUS = ['ACTIVE', 'INACTIVE', 'BLOCKED'] as const

export type Status = (typeof STATUS)[number]
