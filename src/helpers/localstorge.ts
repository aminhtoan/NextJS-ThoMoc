
export const clearLocalStorage = () => {
  localStorage.removeItem('userData')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessToken')
}