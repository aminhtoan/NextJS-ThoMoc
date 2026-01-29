import handleAPI from 'src/apis/handleAPI'
import { LoginFormData, LoginVerifyFormData } from 'src/types/auth'

export const loginAuth = async (data: LoginFormData) => {
  return await handleAPI('/auth/login', data, 'post')
}

export const loginVerify = async (data: LoginVerifyFormData) => {
  return await handleAPI('/auth/login/verify', data, 'post')
}