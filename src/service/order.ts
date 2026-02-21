import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreateOrderBodyType, GetOrderQueryType } from 'src/types/order'

// Create order (from cart items)
export const createOrder = async (data: CreateOrderBodyType) => {
  return await handleAPI(API_CONFIG.ORDER.ORDER, data, 'post')
}

// Get order list
export const getOrders = async (params?: GetOrderQueryType) => {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', String(params.page))
  if (params?.limit) query.append('limit', String(params.limit))
  if (params?.status) query.append('status', params.status)

  const queryString = query.toString()

  return await handleAPI(`${API_CONFIG.ORDER.ORDER}${queryString ? `?${queryString}` : ''}`)
}

// Get order detail
export const getOrderDetail = async (orderId: number) => {
  return await handleAPI(`${API_CONFIG.ORDER.ORDER}/detail/${orderId}`)
}

// Cancel order
export const cancelOrder = async (orderId: number) => {
  return await handleAPI(`${API_CONFIG.ORDER.ORDER}/cancel/${orderId}`, {}, 'delete')
}

// Get delivery methods (active only)
export const getActiveDeliveryMethods = async () => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}?page=1&limit=100`)
}

// Get payment methods (active only)
export const getActivePaymentMethods = async () => {
  return await handleAPI(API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD)
}
