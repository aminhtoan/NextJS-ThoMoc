import { decodeAccessToken } from 'src/service/token'
import axios from 'axios'
import { refreshTokenAuth } from 'src/service/auth'
import { AccessTokenPayLoad } from 'src/types/jwt'
import { clearLocalStorage } from 'src/helpers/localstorge'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8888/api'

// Tạo instance Axios chung
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Thêm interceptor nếu cần (ví dụ thêm token)
api.interceptors.request.use(
  async config => {
    const lang = localStorage.getItem('i18nextLng')

    config.headers['Accept-Language'] = lang

    // Skip interceptor for refresh token API call
    if (config.url?.includes('/auth/refresh')) {
      return config
    }

    const accessToken = JSON.parse(localStorage.getItem('accessToken') || 'null')
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken') || 'null')

    if (!accessToken) return config

    const decodedAccessToken: AccessTokenPayLoad | null = decodeAccessToken(accessToken)

    // Check if the access token is still valid
    if (decodedAccessToken?.exp && decodedAccessToken.exp > Date.now() / 1000) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`

      return config
    }

    // Access token expired, check refresh token
    if (refreshToken) {
      const decodedRefreshToken: AccessTokenPayLoad | null = decodeAccessToken(refreshToken)

      // Check if the refresh token is still valid
      if (decodedRefreshToken?.exp && decodedRefreshToken.exp > Date.now() / 1000) {
        try {
          const response = await refreshTokenAuth({ refreshToken })

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('accessToken', JSON.stringify(newAccessToken))
          localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken))

          config.headers.Authorization = `Bearer ${newAccessToken}`

          return config
        } catch (error) {
          clearLocalStorage()
          window.location.href = '/login'

          return Promise.reject(error)
        }
      }
    }

    // If no valid refresh token, redirect to login
    clearLocalStorage()
    window.location.href = '/login'

    return config
  },
  error => Promise.reject(error)
)

export default api
