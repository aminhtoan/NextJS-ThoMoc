export const VerticalItems = [
  {
    title: 'Dashboard',
    icon: 'ic:baseline-dashboard',
    text: 'Dashboard',
    path: '/'
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
    path: '/admin/brands',
    children: [
      {
        title: 'All Brands',
        icon: 'ic:baseline-list',
        text: 'All Brands'
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
    path: '/admin/categories',
    children: [
      {
        title: 'All Categories',
        icon: 'ic:baseline-list',
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
    path: '/admin/products',
    children: [
      {
        title: 'All Products',
        icon: 'ic:baseline-list',
        text: 'All Products'
      },
      {
        title: 'Add New Product',
        icon: 'ic:baseline-add-box',
        text: 'Add New Product'
      },
      {
        title: 'Product Reviews',
        icon: 'ic:baseline-rate-review',
        text: 'Product Reviews'
      },
      {
        title: 'Product Tags',
        icon: 'ic:baseline-label',
        text: 'Product Tags'
      },
      {
        title: 'Review Products',
        icon: 'ic:baseline-rate-review',
        text: 'Review Products'
      }
    ]
  },
  {
    title: 'Users',
    icon: 'ic:baseline-people',
    text: 'Users',
    path: '/admin/users',
    children: [
      {
        title: 'All Users',
        icon: 'ic:baseline-list',
        text: 'All Users'
      },
      {
        title: 'Add New User',
        icon: 'ic:baseline-person-add',
        text: 'Add New User'
      },
      {
        title: 'User Roles',
        icon: 'ic:baseline-security',
        text: 'User Roles'
      }
    ]
  }
]
