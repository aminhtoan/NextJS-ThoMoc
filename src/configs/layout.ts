export const VerticalItems = [
  {
    title: 'Dashboard',
    icon: 'ic:baseline-dashboard',
    text: 'Dashboard',
    path: '/admin'
  },
  {
    title: 'Orders',
    icon: 'ic:baseline-shopping-cart',
    text: 'Orders',
    children: [
      {
        title: 'All Orders',
        icon: 'ic:baseline-list',
        text: 'All Orders',
        path: '/admin/orders'
      }
    ]
  },
  {
    title: 'Brands',
    icon: 'ic:baseline-label',
    text: 'Brands',
    children: [
      {
        title: 'All Brands',
        icon: 'ic:baseline-list',
        text: 'All Brands',
        path: '/admin/brands'
      }
    ]
  },
  {
    title: 'Categories',
    icon: 'ic:baseline-category',
    text: 'Categories',
    children: [
      {
        title: 'All Categories',
        icon: 'ic:baseline-list',
        path: '/admin/categories',
        text: 'All Categories'
      }
    ]
  },
  {
    title: 'Products',
    icon: 'ic:baseline-inventory',
    text: 'Products',
    children: [
      {
        title: 'All Products',
        icon: 'ic:baseline-list',
        text: 'All Products',
        path: '/admin/products'
      },
      {
        title: 'Add New Product',
        icon: 'ic:baseline-add-box',
        text: 'Add New Product',
        path: '/admin/products/add'
      },
      {
        title: 'Product Translations',
        icon: 'ic:baseline-translate',
        text: 'Product Translations',
        path: '/admin/products/translations'
      },
      {
        title: 'Product Reviews',
        icon: 'ic:baseline-rate-review',
        text: 'Product Reviews',
        path: '/admin/products/reviews'
      }
    ]
  },
  {
    title: 'Users',
    icon: 'ic:baseline-people',
    text: 'Users',
    children: [
      {
        title: 'All Users',
        icon: 'ic:baseline-list',
        text: 'All Users',
        path: '/admin/users'
      },
      {
        title: 'User Roles',
        icon: 'ic:baseline-security',
        text: 'User Roles',
        path: '/admin/users/user-roles'
      }
    ]
  },
  {
    title: 'All Reviews',
    icon: 'ic:baseline-rate-review',
    text: 'All Reviews',
    path: '/admin/reviews'
  },
  {
    title: 'Settings',
    icon: 'ic:baseline-settings',
    text: 'Settings',
    children: [
      {
        title: 'Payment Methods',
        icon: 'ic:baseline-payment',
        text: 'Payment Methods',
        path: '/admin/settings/payment-methods'
      },
      {
        title: 'Delivery Methods',
        icon: 'ic:baseline-local-shipping',
        text: 'Delivery Methods',
        path: '/admin/settings/delivery-methods'
      }
    ]
  }
]

export const VerticalItemsSeller = [
  {
    title: 'Dashboard',
    icon: 'ic:baseline-dashboard',
    text: 'Dashboard',
    path: '/seller'
  },
  {
    title: 'Orders',
    icon: 'ic:baseline-shopping-cart',
    text: 'Orders',
    children: [
      {
        title: 'All Orders',
        icon: 'ic:baseline-list',
        text: 'All Orders',
        path: '/seller/orders'
      }
    ]
  },
  {
    title: 'Brands',
    icon: 'ic:baseline-label',
    text: 'Brands',
    children: [
      {
        title: 'All Brands',
        icon: 'ic:baseline-list',
        text: 'All Brands',
        path: '/seller/brands'
      }
    ]
  },
  {
    title: 'Categories',
    icon: 'ic:baseline-category',
    text: 'Categories',
    children: [
      {
        title: 'All Categories',
        icon: 'ic:baseline-list',
        path: '/seller/categories',
        text: 'All Categories'
      }
    ]
  },
  {
    title: 'Products',
    icon: 'ic:baseline-inventory',
    text: 'Products',
    children: [
      {
        title: 'All Products',
        icon: 'ic:baseline-list',
        text: 'All Products',
        path: '/seller/products'
      },
      {
        title: 'Add New Product',
        icon: 'ic:baseline-add-box',
        text: 'Add New Product',
        path: '/seller/products/add'
      },
      {
        title: 'Product Translations',
        icon: 'ic:baseline-translate',
        text: 'Product Translations',
        path: '/seller/products/translations'
      },
      {
        title: 'Product Reviews',
        icon: 'ic:baseline-rate-review',
        text: 'Product Reviews',
        path: '/seller/products/reviews'
      }
    ]
  },
  {
    title: 'All Reviews',
    icon: 'ic:baseline-rate-review',
    text: 'All Reviews',
    path: '/seller/reviews'
  }
]
