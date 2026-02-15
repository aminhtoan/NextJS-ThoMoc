import handleAPI from 'src/apis/handleAPI'
import { CreateDeliveryMethodType, UpdateDeliveryMethodType } from 'src/types/delivery-methods'

export const getDeliveryMethods = async (page: number, limit: number) => {
  return await handleAPI(`delivery-methods?page=${page}&limit=${limit}`)
}

export const createDeliveryMethod = async (data: CreateDeliveryMethodType) => {
  return await handleAPI('delivery-methods', data, 'post')
}

export const updateDeliveryMethod = async (id: number, data: UpdateDeliveryMethodType) => {
  return await handleAPI(`delivery-methods/${id}`, data, 'put')
}

export const deleleDeliveryMethod = async (id: number) => {
  return await handleAPI(`delivery-methods/${id}`, {}, 'delete')
}

export const restoreDeliveryMethod = async (id: number) => {
  return await handleAPI(`delivery-methods/${id}/restore`, {}, 'post')
}

export const toggleDeliveryMethodStatus = async (id: number) => {
  return await handleAPI(`delivery-methods/${id}/toggle-status`, {}, 'patch')
}
