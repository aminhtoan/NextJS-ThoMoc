import { jwtDecode } from 'jwt-decode'
import { AccessTokenPayLoad, RefreshTokenPayLoad } from 'src/types/jwt'

// Lưu token vào localStorage
export function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token)
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken')
}

export function decodeAccessToken(token: string): AccessTokenPayLoad | null {
  try {
    return jwtDecode<AccessTokenPayLoad>(token)
  } catch {
    return null
  }
}

// Tương tự cho refresh token
export function setRefreshToken(token: string) {
  localStorage.setItem('refreshToken', token)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}

export function removeRefreshToken() {
  localStorage.removeItem('refreshToken')
}

export function decodeRefreshToken(token: string): RefreshTokenPayLoad | null {
  try {
    return jwtDecode<RefreshTokenPayLoad>(token)
  } catch {
    return null
  }
}
