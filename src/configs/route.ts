// ==================== PUBLIC ROUTES ====================
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  UNAUTHORIZED: '/401'
}

// ==================== AUTH ROUTES ====================
export const AUTH_ROUTES = {
  MY_PROFILE: '/my-profile',
  PROFILE_ADDRESS: '/my-profile/address',
  PROFILE_EMAIL: '/my-profile/email',
  PROFILE_CHANGE_PASSWORD: '/my-profile/change-password',
  PROFILE_PRIVACY_SETTINGS: '/my-profile/privacy-settings'
}

// ==================== ADMIN ROUTES ====================
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',

  // Orders
  ORDERS: '/admin/orders',
  ORDERS_ALL: '/admin/orders?status=all',
  ORDERS_PENDING: '/admin/orders?status=pending',
  ORDERS_COMPLETED: '/admin/orders?status=completed',
  ORDERS_CANCELLED: '/admin/orders?status=cancelled',

  // Brands
  BRANDS: '/admin/brands',
  BRANDS_ALL: '/admin/brands',
  BRANDS_ADD: '/admin/brands/add',
  BRAND_CATEGORIES: '/admin/brands/categories',

  // Categories
  CATEGORIES: '/admin/categories',
  CATEGORIES_ALL: '/admin/categories',
  CATEGORIES_ADD: '/admin/categories/add',

  // Products
  PRODUCTS: '/admin/products',
  PRODUCTS_ALL: '/admin/products',
  PRODUCTS_ADD: '/admin/products/add',
  PRODUCT_REVIEWS: '/admin/products/reviews',
  PRODUCT_TAGS: '/admin/products/tags',

  // Users
  USERS: '/admin/users',
  USERS_ALL: '/admin/users',
  USERS_ADD: '/admin/users/add',
  USER_ROLES: '/admin/users/roles'
}

// ==================== SELLER ROUTES ====================
export const SELLER_ROUTES = {
  DASHBOARD: '/seller',
  PRODUCTS: '/seller/products',
  ORDERS: '/seller/orders',
  ANALYTICS: '/seller/analytics'
}

// ==================== OAUTH ROUTES ====================
export const OAUTH_ROUTES = {
  GOOGLE_CALLBACK: '/oauth-google-callback',
  FACEBOOK_CALLBACK: '/oauth-facebook-callback'
}

// ==================== ROUTE CONFIG (Legacy) ====================
export const ROUTE_CONFIG = {
  // Public
  HOME: PUBLIC_ROUTES.HOME,
  LOGIN: PUBLIC_ROUTES.LOGIN,
  REGISTER: PUBLIC_ROUTES.REGISTER,

  // Auth
  MY_PROFILE: AUTH_ROUTES.MY_PROFILE,
  CHANGE_PASSWORD: AUTH_ROUTES.PROFILE_CHANGE_PASSWORD,

  // Admin
  ADMIN_DASHBOARD: ADMIN_ROUTES.DASHBOARD,
  ADMIN_ORDERS: ADMIN_ROUTES.ORDERS,
  ADMIN_PRODUCTS: ADMIN_ROUTES.PRODUCTS,
  ADMIN_USERS: ADMIN_ROUTES.USERS,

  // Seller
  SELLER_DASHBOARD: SELLER_ROUTES.DASHBOARD
}

// ==================== PROTECTED ROUTES ====================
// Routes that require authentication
export const PROTECTED_ROUTES = [
  ...Object.values(AUTH_ROUTES),
  ...Object.values(ADMIN_ROUTES),
  ...Object.values(SELLER_ROUTES)
]

// ==================== PUBLIC ACCESSIBLE ROUTES ====================
export const PUBLIC_ACCESSIBLE_ROUTES = [
  PUBLIC_ROUTES.HOME,
  PUBLIC_ROUTES.LOGIN,
  PUBLIC_ROUTES.REGISTER,
  PUBLIC_ROUTES.NOT_FOUND,
  PUBLIC_ROUTES.SERVER_ERROR,
  PUBLIC_ROUTES.UNAUTHORIZED,
  OAUTH_ROUTES.GOOGLE_CALLBACK,
  OAUTH_ROUTES.FACEBOOK_CALLBACK
]

// ==================== ROLE-BASED ROUTES ====================
export const ROLE_BASED_ROUTES = {
  ADMIN: [...Object.values(ADMIN_ROUTES), ...Object.values(AUTH_ROUTES)],
  SELLER: [...Object.values(SELLER_ROUTES), ...Object.values(AUTH_ROUTES)],
  USER: [...Object.values(AUTH_ROUTES)]
}

// ==================== REDIRECT ROUTES ====================
export const REDIRECT_ROUTES = {
  // After login redirects
  AFTER_LOGIN_ADMIN: ADMIN_ROUTES.DASHBOARD,
  AFTER_LOGIN_SELLER: SELLER_ROUTES.DASHBOARD,
  AFTER_LOGIN_USER: PUBLIC_ROUTES.HOME,

  // After logout
  AFTER_LOGOUT: PUBLIC_ROUTES.LOGIN,

  // Token expiration
  TOKEN_EXPIRED: PUBLIC_ROUTES.LOGIN
}

// ==================== HELPERS ====================
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    const routePattern = route.split('?')[0] // Remove query params

    return path.startsWith(routePattern)
  })
}

export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ACCESSIBLE_ROUTES.some(route => {
    const routePattern = route.split('?')[0]

    return path.startsWith(routePattern)
  })
}

export const getRedirectPathByRole = (role: string): string => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return REDIRECT_ROUTES.AFTER_LOGIN_ADMIN
    case 'SELLER':
      return REDIRECT_ROUTES.AFTER_LOGIN_SELLER
    default:
      return REDIRECT_ROUTES.AFTER_LOGIN_USER
  }
}

export default ROUTE_CONFIG
