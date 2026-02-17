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
      },
      {
        title: 'Pending Orders',
        icon: 'ic:baseline-hourglass-empty',
        text: 'Pending Orders',
        path: '/admin/orders?status=pending'
      },
      {
        title: 'Completed Orders',
        icon: 'ic:baseline-check-circle',
        text: 'Completed Orders',
        path: '/admin/orders?status=completed'
      },
      {
        title: 'Cancelled Orders',
        icon: 'ic:baseline-cancel',
        text: 'Cancelled Orders',
        path: '/admin/orders?status=cancelled'
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
      },
      {
        title: 'Add New Brand',
        icon: 'ic:baseline-add-box',
        text: 'Add New Brand'
      },
      {
        title: 'Brand Categories',
        icon: 'ic:baseline-category',
        text: 'Brand Categories'
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
      },
      {
        title: 'Add New Category',
        icon: 'ic:baseline-add-box',
        text: 'Add New Category'
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
        title: 'Product Reviews',
        icon: 'ic:baseline-rate-review',
        text: 'Product Reviews'
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
