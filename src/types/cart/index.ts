import * as yup from 'yup'

// Cart item basic schema
export const CartItemSchema = yup.object({
  id: yup.number().required(),
  quantity: yup.number().positive().integer().required(),
  skuId: yup.number().required(),
  userId: yup.number().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

// SKU schema for cart
export const CartSKUSchema = yup.object({
  id: yup.number().required(),
  value: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().required(),
  image: yup.string().nullable(),
  productId: yup.number().required(),
  product: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    basePrice: yup.number().required(),
    virtualPrice: yup.number().required(),
    images: yup.array().of(yup.string()),
    productTranslations: yup.array().of(
      yup.object({
        id: yup.number(),
        productId: yup.number(),
        languageId: yup.string(),
        name: yup.string(),
        description: yup.string()
      })
    )
  })
})

// Cart item with full details
export const CartItemDetailSchema = yup.object({
  id: yup.number().required(),
  quantity: yup.number().positive().integer().required(),
  skuId: yup.number().required(),
  userId: yup.number().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  sku: CartSKUSchema
})

// Shop with cart items
export const ShopCartSchema = yup.object({
  shop: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    avatar: yup.string().nullable()
  }),
  cartItems: yup.array().of(CartItemDetailSchema)
})

// Get cart response
export const GetCartResSchema = yup.object({
  data: yup.array().of(ShopCartSchema),
  totalItems: yup.number().required(),
  page: yup.number().required(),
  limit: yup.number().required(),
  totalPages: yup.number().required()
})

// Add to cart body
export const AddToCartBodySchema = yup.object({
  skuId: yup.number().positive().integer().required(),
  quantity: yup.number().positive().integer().required()
})

// Update cart item body
export const UpdateCartItemBodySchema = yup.object({
  quantity: yup.number().positive().integer().required(),
  skuId: yup.number().positive().integer().optional()
})

// Remove cart items body
export const RemoveCartItemBodySchema = yup.object({
  cartItemIds: yup.array().of(yup.number().positive().integer().required()).required()
})

// Types
export type CartItemType = yup.InferType<typeof CartItemSchema>
export type CartSKUType = yup.InferType<typeof CartSKUSchema>
export type CartItemDetailType = yup.InferType<typeof CartItemDetailSchema>
export type ShopCartType = yup.InferType<typeof ShopCartSchema>
export type GetCartResType = yup.InferType<typeof GetCartResSchema>
export type AddToCartBodyType = yup.InferType<typeof AddToCartBodySchema>
export type UpdateCartItemBodyType = yup.InferType<typeof UpdateCartItemBodySchema>
export type RemoveCartItemBodyType = yup.InferType<typeof RemoveCartItemBodySchema>
