export const STATUS = ['ACTIVE', 'INACTIVE'] as const

export const STATUS_1 = ['Active', 'Inactive'] as const


export type Status = (typeof STATUS)[number]
