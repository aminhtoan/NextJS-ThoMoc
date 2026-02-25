import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreateCategoryBodyType, GetAllCategoriesQueryType, UpdateCategoryBodyType } from 'src/types/category'

export const GetCategory = async (query?: GetAllCategoriesQueryType) => {
  const queryParams = new URLSearchParams()
  if (query?.parentCategoryId) queryParams.append('parentCategoryId', query.parentCategoryId.toString())

  return await handleAPI(`${API_CONFIG.CATEGORY.CATEGORY}? ${queryParams.toString()}`)
}

export const GetCategoryDetail = async (categoryId: number) => {
  return await handleAPI(`${API_CONFIG.CATEGORY.CATEGORY}/${categoryId}`)
}

export const CreateCategory = async (
  data: Omit<CreateCategoryBodyType, 'parentCategoryId'> & { parentCategoryId?: number }
) => {
  return await handleAPI(API_CONFIG.CATEGORY.CATEGORY, data, 'post')
}

export const UpdateCategory = async (
  categoryId: number,
  data: Omit<UpdateCategoryBodyType, 'parentCategoryId'> & { parentCategoryId?: number }
) => {
  return await handleAPI(`${API_CONFIG.CATEGORY.CATEGORY}/${categoryId}`, data, 'put')
}

export const deleteCategory = async (categoryId: number) => {
  return await handleAPI(`${API_CONFIG.CATEGORY.CATEGORY}/${categoryId}`, {}, 'delete')
}
