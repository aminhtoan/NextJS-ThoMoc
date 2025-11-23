export const TypeofVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA'
} as const

export type TypeofVerificationCodeType = (typeof TypeofVerificationCode)[keyof typeof TypeofVerificationCode]
