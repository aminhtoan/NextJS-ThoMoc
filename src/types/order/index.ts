import * as yup from 'yup'

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PICKUP: 'PENDING_PICKUP',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED'
} as const

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PICKUP: 'PENDING_PICKUP',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED'
}
export const ORDER_STATUS_COLORS: Record<OrderStatusType, string> = {
  PENDING_PAYMENT: '#ff9800',
  PENDING_PICKUP: '#2196f3',
  PENDING_DELIVERY: '#1677ff',
  DELIVERED: '#4caf50',
  RETURNED: '#f44336',
  CANCELLED: '#9e9e9e'
}

// ==================== RECEIVER ====================
export const ReceiverSchema = yup.object({
  name: yup.string().required('Tên người nhận là bắt buộc'),
  phone: yup.string().min(9).max(20).required('Số điện thoại là bắt buộc'),
  address: yup.string().required('Địa chỉ là bắt buộc')
})

export type ReceiverType = yup.InferType<typeof ReceiverSchema>

// ==================== PRODUCT SKU SNAPSHOT ====================
export const ProductSKUSnapshotSchema = yup.object({
  id: yup.number().required(),
  productId: yup.number().nullable(),
  productName: yup.string().required(),
  productTranslations: yup.array().of(
    yup.object({
      name: yup.string().required(),
      description: yup.string().default(''),
      languageId: yup.string().required()
    })
  ),
  skuPrice: yup.number().required(),
  image: yup.string().default(''),
  skuValue: yup.string().default(''),
  skuId: yup.number().nullable(),
  orderId: yup.number().nullable(),
  quantity: yup.number().required(),
  createdAt: yup.date().required()
})

export type ProductSKUSnapshotType = yup.InferType<typeof ProductSKUSnapshotSchema>

// ==================== ORDER ====================
export const OrderSchema = yup.object({
  id: yup.number().required(),
  userId: yup.number().required(),
  status: yup
    .mixed<OrderStatusType>()
    .oneOf(Object.values(ORDER_STATUS) as OrderStatusType[])
    .required(),
  receiver: ReceiverSchema.nullable(),
  shopId: yup.number().nullable(),
  paymentId: yup.number().optional(),
  deliveryMethodId: yup.number().nullable(),
  shippingFee: yup.number().default(0),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  deletedAt: yup.date().nullable()
})

export type OrderType = yup.InferType<typeof OrderSchema>

// Order with items (list)
export const OrderWithItemsSchema = OrderSchema.omit(['receiver', 'deletedAt']).shape({
  items: yup.array().of(ProductSKUSnapshotSchema).default([]),
  reviews: yup
    .array()
    .of(
      yup.object({
        id: yup.number().required(),
        content: yup.string().required(),
        rating: yup.number().required(),
        orderId: yup.number().required(),
        productId: yup.number().required(),
        userId: yup.number().required(),
        updateCount: yup.number().required(),
        createdAt: yup.string().required(),
        updatedAt: yup.string().required(),
        medias: yup
          .array()
          .of(
            yup.object({
              id: yup.number().required(),
              url: yup.string().required(),
              type: yup.mixed<'IMAGE' | 'VIDEO'>().oneOf(['IMAGE', 'VIDEO']).required(),
              reviewId: yup.number().required(),
              createdAt: yup.string().required()
            })
          )
          .default([]),
        user: yup
          .object({
            id: yup.number().required(),
            name: yup.string().required(),
            avatar: yup.string().required()
          })
          .required()
      })
    )
    .default([])
})

export type OrderWithItemsType = yup.InferType<typeof OrderWithItemsSchema>

// Order detail (full)
export const OrderDetailSchema = OrderSchema.shape({
  items: yup.array().of(ProductSKUSnapshotSchema).default([]),
  shippingFee: yup.number().default(0),
  payment: yup
    .object({
      id: yup.number().required(),
      status: yup.string().required(),
      amount: yup.number().default(0),
      paymentMethod: yup
        .object({
          id: yup.number().required(),
          name: yup.string().required(),
          code: yup.string().required()
        })
        .nullable()
        .optional(),
      createdAt: yup.date().required(),
      updatedAt: yup.date().required()
    })
    .nullable()
    .optional(),
  deliveryMethod: yup
    .object({
      id: yup.number().required(),
      name: yup.string().required(),
      code: yup.string().required(),
      price: yup.number().default(0),
      description: yup.string().nullable().optional()
    })
    .nullable()
    .optional()
})

export type OrderDetailType = yup.InferType<typeof OrderDetailSchema>

// ==================== GET ORDER LIST ====================
export const GetOrderListResSchema = yup.object({
  page: yup.number().required(),
  limit: yup.number().required(),
  totalItems: yup.number().required(),
  totalPages: yup.number().required(),
  data: yup.array().of(OrderWithItemsSchema).default([])
})

export type GetOrderListResType = yup.InferType<typeof GetOrderListResSchema>

// ==================== CREATE ORDER ====================
export const CreateOrderItemSchema = yup.object({
  shopId: yup.number().required('Shop ID là bắt buộc'),
  receiver: ReceiverSchema.required(),
  cartItemIds: yup.array().of(yup.number().required()).min(1, 'Cần ít nhất 1 sản phẩm').required(),
  paymentMethodCode: yup.string().required('Phương thức thanh toán là bắt buộc'),
  deliveryMethodCode: yup.string().required('Phương thức vận chuyển là bắt buộc')
})

export type CreateOrderItemType = yup.InferType<typeof CreateOrderItemSchema>

export const CreateOrderBodySchema = yup.array().of(CreateOrderItemSchema).min(1).required()

export type CreateOrderBodyType = yup.InferType<typeof CreateOrderBodySchema>

// ==================== CREATE ORDER RESPONSE ====================
export const CreateOrderResSchema = yup.object({
  data: yup.array().of(
    OrderSchema.shape({
      paymentId: yup.number().optional(),
      totalAmount: yup.number().optional(),
      productTotal: yup.number().optional(),
      shippingFee: yup.number().optional()
    })
  )
})

export type CreateOrderResType = yup.InferType<typeof CreateOrderResSchema>

// ==================== QUERY PARAMS ====================
export const GetOrderQuerySchema = yup.object({
  page: yup.number().positive().integer().default(1),
  limit: yup.number().positive().integer().default(10),
  status: yup
    .mixed<OrderStatusType>()
    .oneOf(Object.values(ORDER_STATUS) as OrderStatusType[])
    .optional()
})

export type GetOrderQueryType = yup.InferType<typeof GetOrderQuerySchema>

// ==================== ADMIN ORDER TYPES ====================

export const AdminOrderUserSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  email: yup.string().required(),
  avatar: yup.string().nullable().optional()
})

export type AdminOrderUserType = yup.InferType<typeof AdminOrderUserSchema>

export const AdminOrderSchema = OrderDetailSchema.shape({
  user: AdminOrderUserSchema.optional()
})

export type AdminOrderType = yup.InferType<typeof AdminOrderSchema>

export const AdminGetOrderListResSchema = yup.object({
  page: yup.number().required(),
  limit: yup.number().required(),
  totalItems: yup.number().required(),
  totalPages: yup.number().required(),
  data: yup.array().of(AdminOrderSchema).default([])
})

export type AdminGetOrderListResType = yup.InferType<typeof AdminGetOrderListResSchema>

export const AdminGetOrderQuerySchema = yup.object({
  page: yup.number().positive().integer().default(1),
  limit: yup.number().positive().integer().default(10),
  status: yup
    .mixed<OrderStatusType>()
    .oneOf(Object.values(ORDER_STATUS) as OrderStatusType[])
    .optional(),
  search: yup.string().optional(),
  id: yup.number().positive().integer().optional()
})

export type AdminGetOrderQueryType = yup.InferType<typeof AdminGetOrderQuerySchema>

export const AdminUpdateOrderStatusSchema = yup.object({
  status: yup
    .mixed<OrderStatusType>()
    .oneOf(Object.values(ORDER_STATUS) as OrderStatusType[])
    .required('Trạng thái là bắt buộc')
})

export type AdminUpdateOrderStatusType = yup.InferType<typeof AdminUpdateOrderStatusSchema>

export interface AdminOrderStatisticsType {
  total: number
  byStatus: Record<OrderStatusType, number>
}

// Valid status transitions for admin
export const VALID_STATUS_TRANSITIONS: Record<OrderStatusType, OrderStatusType[]> = {
  PENDING_PAYMENT: ['PENDING_PICKUP', 'CANCELLED'],
  PENDING_PICKUP: ['PENDING_DELIVERY', 'CANCELLED'],
  PENDING_DELIVERY: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  RETURNED: [],
  CANCELLED: []
}
