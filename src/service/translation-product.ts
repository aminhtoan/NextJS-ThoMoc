import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

const BASE = API_CONFIG.PRODUCT_TRANSLATION.PRODUCT_TRANSLATION

export const getProductTranslationsByProductId = async (productId: number) => {
  return await handleAPI(`${BASE}/product/${productId}`)
}

export const createProductTranslation = async (data: {
  productId: number
  name: string
  description: string
  languageId: string
}) => {
  return await handleAPI(BASE, data, 'post')
}

export const getProductTranslationDetail = async (productTranslationId: number) => {
  return await handleAPI(`${BASE}/${productTranslationId}`)
}

export const updateProductTranslation = async (
  productTranslationId: number,
  data: {
    name?: string
    description?: string
    languageId?: string
  }
) => {
  return await handleAPI(`${BASE}/${productTranslationId}`, data, 'put')
}

export const deleteProductTranslation = async (productTranslationId: number) => {
  return await handleAPI(`${BASE}/${productTranslationId}`, {}, 'delete')
}
