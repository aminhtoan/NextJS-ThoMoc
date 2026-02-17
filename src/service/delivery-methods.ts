import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreateDeliveryMethodType, UpdateDeliveryMethodType } from 'src/types/delivery-methods'

export const getDeliveryMethods = async (page: number, limit: number) => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}?page=${page}&limit=${limit}`)
}

export const createDeliveryMethod = async (data: CreateDeliveryMethodType) => {
  return await handleAPI(API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD, data, 'post')
}

export const updateDeliveryMethod = async (id: number, data: UpdateDeliveryMethodType) => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}/${id}`, data, 'put')
}

export const deleteDeliveryMethod = async (id: number) => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}/${id}`, {}, 'delete')
}

export const restoreDeliveryMethod = async (id: number) => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}/${id}/restore`, {}, 'post')
}

export const toggleDeliveryMethodStatus = async (id: number) => {
  return await handleAPI(`${API_CONFIG.DELIVERY_METHOD.DELIVERY_METHOD}/${id}/toggle-status`, {}, 'patch')
}
