export default {
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export const TypeofVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_EMAIL: 'CHANGE_EMAIL'
} as const

export type TypeofVerificationCodeType = (typeof TypeofVerificationCode)[keyof typeof TypeofVerificationCode]

export const AUTH_LOG = [
  { value: 'login', label: 'Đăng nhập', path: '/login' },
  { value: 'register', label: 'Đăng ký', path: '/register' }
]

export const ACCESS_TOKEN = 'accessToken'
export const REFRESH_TOKEN = 'refreshToken'
export const USER_DATA = 'userData'
export const TEMPORARY_TOKEN = 'accessToken'
