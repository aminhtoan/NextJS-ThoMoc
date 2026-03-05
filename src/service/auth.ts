import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import {
  LoginFormData,
  LoginVerifyFormData,
  RefreshTokenBodyType,
  RegisterBodyType,
  VerifyOTPType
} from 'src/types/auth'

export const loginAuth = async (data: LoginFormData) => {
  return await handleAPI(API_CONFIG.AUTH_API.LOGIN, data, 'post')
}

export const loginVerify = async (data: LoginVerifyFormData) => {
  return await handleAPI(API_CONFIG.AUTH_API.LOGIN_VERIFY, data, 'post')
}

export const authMe = async () => {
  return await handleAPI(API_CONFIG.AUTH_API.ME)
}

export const logoutAuth = async (data: RefreshTokenBodyType) => {
  return await handleAPI(API_CONFIG.AUTH_API.LOGOUT, data.refreshToken, 'post')
}

export const sentOTP = async (email: string, type: string) => {
  return await handleAPI(API_CONFIG.AUTH_API.SEND_OTP, { email, type }, 'post')
}

export const verifyOTP = async (data: VerifyOTPType) => {
  return await handleAPI(API_CONFIG.AUTH_API.OTP_VERIFY, data, 'post')
}

export const registerAuth = async (data: RegisterBodyType) => {
  return await handleAPI(API_CONFIG.AUTH_API.REGISTER, data, 'post')
}

export const refreshTokenAuth = async (data: RefreshTokenBodyType) => {
  return await handleAPI(API_CONFIG.AUTH_API.REFRESH_TOKEN, data, 'post')
}

export const verifyEmailAuth = async (email: string) => {
  return await handleAPI(API_CONFIG.AUTH_API.VERIFY_EMAIL, { email }, 'post')
}

export const changePasswordAuth = async (oldPassword: string, newPassword: string) => {
  return await handleAPI(API_CONFIG.AUTH_API.CHANGE_PASSWORD, { oldPassword, newPassword }, 'put')
}

export const getDevices = async () => {
  return await handleAPI(API_CONFIG.AUTH_API.DEVICES)
}

export const removeDevice = async (deviceId: number) => {
  return await handleAPI(`${API_CONFIG.AUTH_API.DEVICES}/${deviceId}`, undefined, 'delete')
}
