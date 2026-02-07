import { TEMPORARY_TOKEN } from 'src/configs/auth'

export const clearLocalStorage = () => {
  localStorage.removeItem('userData')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessToken')
}

export const setTemporaryToken = (accessToken: string) => {
  window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
}

export const getTemporaryToken = () => {
  return window.localStorage.getItem(TEMPORARY_TOKEN)
}

export const clearTemporaryToken = () => {
  window.localStorage.removeItem(TEMPORARY_TOKEN)
}
