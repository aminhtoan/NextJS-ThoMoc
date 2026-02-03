import handleAPI from 'src/apis/handleAPI'
import {
  LoginFormData,
  LoginVerifyFormData,
  RefreshTokenBodyType,
  RegisterBodyType,
  VerifyOTPType
} from 'src/types/auth'

export const loginAuth = async (data: LoginFormData) => {
  return await handleAPI('/auth/login', data, 'post')
}

export const loginVerify = async (data: LoginVerifyFormData) => {
  return await handleAPI('/auth/login/verify', data, 'post')
}

export const authMe = async () => {
  return await handleAPI('/auth/me')
}

export const logoutAuth = async (data: RefreshTokenBodyType) => {
  return await handleAPI('/auth/logout', data.refreshToken, 'post')
}

export const sentOTP = async (email: string, type: string) => {
  return await handleAPI('/auth/otp', { email, type }, 'post')
}

export const verifyOTP = async (data: VerifyOTPType) => {
  return await handleAPI('/auth/otp/verify', data, 'post')
}

export const registerAuth = async (data: RegisterBodyType) => {
  return await handleAPI('/auth/register', data, 'post')
}

export const refreshTokenAuth = async (data: RefreshTokenBodyType) => {
  return await handleAPI('/auth/refresh-token', data, 'post')
}
