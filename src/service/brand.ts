import handleAPI from 'src/apis/handleAPI'
import { CreateBrandBodyType, GetBrandsQueryType, UpdateBrandBodyType } from 'src/types/brand'

export const GetBrand = async (query: GetBrandsQueryType) => {
  return await handleAPI(
    `brand?${query.page ? `page=${query.page}&` : ''}${query.limit ? `limit=${query.limit}&` : ''}${
      query.search ? `search=${query.search}&` : ''
    }`
  )
}

export const GetBrandDetail = async (brandId: number) => {
  return await handleAPI(`brand/${brandId}`)
}

export const CreateBrand = async (data: CreateBrandBodyType) => {
  return await handleAPI('brand', data, 'post')
}

export const UpdateBrand = async (brandId: number, data: UpdateBrandBodyType) => {
  return await handleAPI(`brand/${brandId}`, data, 'put')
}

export const DeleteBrand = async (brandId: number) => {
  return await handleAPI(`brand/${brandId}`, {}, 'delete')
}
