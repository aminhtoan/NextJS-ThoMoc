export default {
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export const AUTH_LOG = [
  { value: 'login', label: 'Đăng nhập', path: '/login' },
  { value: 'register', label: 'Đăng ký', path: '/register' }
]
