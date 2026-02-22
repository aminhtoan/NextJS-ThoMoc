const BASE_URL = process.env.URL_API || 'http://localhost:8888/api'

export const API_CONFIG = {
  BASE_URL,
  AUTH_API: {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    ME: `/auth/me`,
    REGISTER_VERIFY: `/auth/register/register-verify`,
    SEND_OTP: `/auth/otp`,
    OTP_VERIFY: `/auth/otp/verify`,
    LOGIN_VERIFY: `/auth/login/verify`,
    REFRESH_TOKEN: `/auth/refresh-token`,
    LOGOUT: `/auth/logout`,
    VERIFY_EMAIL: `/auth/verify-email`,
    CHANGE_PASSWORD: `/auth/change-password`
  },
  MEDIA_API: {
    UPLOAD_IMAGE_CLOUDINARY: `/media/image/cloudinary`,
    UPLOAD_IMAGES_CLOUDINARY: `/media/images/cloudinary`,

    DEFAULT_AVATAR: `/media/default-avatar`
  },
  ROLE: {
    ROLE: `/role`
  },
  PERMISSION: {
    ALL: `/permission/all`
  },
  USERS: {
    USERS: `/users`
  },
  PAYMENT_METHOD: {
    PAYMENT_METHOD: `/payment-methods`
  },
  ORDER: {
    ORDER: `/order`,
    ADMIN: `/order/admin`,
    ADMIN_STATISTICS: `/order/admin/statistics`
  },
  PRODUCT: {
    PRODUCT: `/product`,
    PRODUCT_CATEGORY: `/product-category`,
    PRODUCT_SKU: `/product-sku`
  },
  BRAND: {
    BRAND: `/brand`
  },
  CART: {
    CART: `/cart`
  },
  CATEGORY: {
    CATEGORY: `/category`
  },
  DELIVERY_METHOD: {
    DELIVERY_METHOD: `/delivery-methods`
  },
  LANGUAGE: {
    LANGUAGE: `/languages`
  },
  PRODUCT_TRANSLATION: {
    PRODUCT_TRANSLATION: `/product-translation`
  }
}
