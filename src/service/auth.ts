import handleAPI from 'src/apis/handleAPI'
import { LoginFormData, LoginVerifyFormData, RefreshTokenBodyData } from 'src/types/auth'

export const loginAuth = async (data: LoginFormData) => {
  return await handleAPI('/auth/login', data, 'post')
}

export const loginVerify = async (data: LoginVerifyFormData) => {
  return await handleAPI('/auth/login/verify', data, 'post')
}

export const authMe = async () => {
  return await handleAPI('/auth/me')
}

export const logoutAuth = async (data: RefreshTokenBodyData) => {
  return await handleAPI('/auth/logout', data.refreshToken, 'post')
}