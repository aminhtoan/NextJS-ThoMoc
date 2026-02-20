import handleAPI from 'src/apis/handleAPI'

export const createCart = async (data: { skuId: number; quantity: number }) => {
  return await handleAPI('/cart', data, 'post')
}

export const getCart = async (page: number, limit: number) => {
  return await handleAPI(`/cart?page=${page}&limit=${limit}`, {}, 'get')
}

export const updateCartItem = async (cartItemId: number, data: { quantity: number; skuId?: number }) => {
  return await handleAPI(`/cart/${cartItemId}`, data, 'patch')
}

export const removeCartItem = async (cartItemIds: number[]) => {
  return await handleAPI('/cart/remove', { cartItemIds }, 'delete')
}
