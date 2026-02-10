export const GROUP_CONFIG: { key: string; label: string; modules: string[] }[] = [
  {
    key: 'product-management',
    label: 'MANAGE-PRODUCT',
    modules: ['MANAGE-PRODUCT', 'BRAND', 'CATEGORY']
  },
  {
    key: 'system',
    label: 'SYSTEM',
    modules: ['PROFILE', 'ROLE', 'PERMISSION', 'AUTH']
  },
  {
    key: 'order-management',
    label: 'Quản trị đơn hàng',
    modules: ['ORDER', 'REVIEW', 'CART', 'PAYMENT']
  },
  {
    key: 'settings',
    label: 'Settings',
    modules: ['MEDIA', 'MESSAGE']
  }
]