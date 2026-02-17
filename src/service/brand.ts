import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreateBrandBodyType, GetBrandsQueryType, UpdateBrandBodyType } from 'src/types/brand'

export const GetBrand = async (query: GetBrandsQueryType) => {
  return await handleAPI(
    `${API_CONFIG.BRAND.BRAND}?${query.page ? `page=${query.page}&` : ''}${query.limit ? `limit=${query.limit}&` : ''}${
      query.search ? `search=${query.search}&` : ''
    }`
  )
}

export const GetBrandDetail = async (brandId: number) => {
  return await handleAPI(`${API_CONFIG.BRAND.BRAND}/${brandId}`)
}

export const CreateBrand = async (data: CreateBrandBodyType) => {
  return await handleAPI(API_CONFIG.BRAND.BRAND, data, 'post')
}

export const UpdateBrand = async (brandId: number, data: UpdateBrandBodyType) => {
  return await handleAPI(`${API_CONFIG.BRAND.BRAND}/${brandId}`, data, 'put')
}

export const DeleteBrand = async (brandId: number) => {
  return await handleAPI(`${API_CONFIG.BRAND.BRAND}/${brandId}`, {}, 'delete')
}
