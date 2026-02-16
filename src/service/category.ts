import handleAPI from 'src/apis/handleAPI'
import { CreateCategoryBodyType, GetAllCategoriesQueryType, UpdateCategoryBodyType } from 'src/types/category'

export const GetCartegory = async (query: GetAllCategoriesQueryType) => {
  const queryParams = new URLSearchParams()
  if (query.parentCategoryId) queryParams.append('parentCategoryId', query.parentCategoryId.toString())

  return await handleAPI(`category?${queryParams.toString()}`)
}

export const GetCategoryDetail = async (categoryId: number) => {
  return await handleAPI(`category/${categoryId}`)
}

export const CreateCategory = async (
  data: Omit<CreateCategoryBodyType, 'parentCategoryId'> & { parentCategoryId?: number }
) => {
  return await handleAPI('category', data, 'post')
}

export const UpdateCategory = async (
  categoryId: number,
  data: Omit<UpdateCategoryBodyType, 'parentCategoryId'> & { parentCategoryId?: number }
) => {
  return await handleAPI(`category/${categoryId}`, data, 'put')
}

export const DeleteCategory = async (categoryId: number) => {
  return await handleAPI(`category/${categoryId}`, {}, 'delete')
}
