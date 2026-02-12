export const STATUS = ['ACTIVE', 'INACTIVE'] as const

export type Status = (typeof STATUS)[number]
