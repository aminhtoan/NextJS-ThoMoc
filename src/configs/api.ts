const BASE_URL = process.env.URL_API || 'http://localhost:8888/api'

export const API_CONFIG = {
  BASE_URL,
  AUTH_API: {
    REGISTER: `${BASE_URL}/auth/register`,
    REGISTER_VERIFY: `${BASE_URL}/auth/register/register-verify`,
    SEND_OTP: `${BASE_URL}/auth/otp`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGIN_VERIFY: `${BASE_URL}/auth/login/verify`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
    LOGOUT: `${BASE_URL}/auth/logout`
  }
}
