import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreatePaymentMethodType } from 'src/types/payment-methods'

export const getPaymentMethods = async () => {
  return await handleAPI(API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD, {}, 'get')
}

export const createPaymentMethod = async (data: CreatePaymentMethodType) => {
  return await handleAPI(API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD, data, 'post')
}

export const delelePaymentMethod = async (id: number) => {
  return await handleAPI(`${API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD}/${id}`, {}, 'delete')
}

export const togglePaymentMethodStatus = async (id: number) => {
  return await handleAPI(`${API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD}/${id}/toggle-status`, {}, 'patch')
}

export const restorePaymentMethod = async (id: number) => {
  return await handleAPI(`${API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD}/${id}/restore`, {}, 'patch')
}

export const updatePaymentMethod = async (id: number, data: Partial<CreatePaymentMethodType>) => {
  return await handleAPI(`${API_CONFIG.PAYMENT_METHOD.PAYMENT_METHOD}/${id}`, data, 'put')
}
