import handleAPI from 'src/apis/handleAPI'
import { CreateProductBodyType, GetManagerProductsQueryType, UpdateProductBodyType } from 'src/types/product'

export const getProducts = async (query: GetManagerProductsQueryType) => {
  const params = new URLSearchParams()

  // Chỉ thêm params khi có giá trị
  if (query.page) params.append('page', query.page.toString())
  if (query.limit) params.append('limit', query.limit.toString())
  if (query.name) params.append('name', query.name)

  // Xử lý brandIds array
  if (query.brandIds && Array.isArray(query.brandIds) && query.brandIds.length > 0) {
    query.brandIds.forEach(id => params.append('brandIds', id.toString()))
  }

  // Xử lý categories array
  if (query.categories && Array.isArray(query.categories) && query.categories.length > 0) {
    query.categories.forEach(id => params.append('categories', id.toString()))
  }

  if (query.minPrice) params.append('minPrice', query.minPrice.toString())
  if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString())
  if (query.createdById) params.append('createdById', query.createdById.toString())

  // Default values cho orderBy và sortBy
  params.append('orderBy', query.orderBy || 'desc')
  params.append('sortBy', query.sortBy || 'createdAt')

  const queryString = params.toString()

  return await handleAPI(`manage-product/product${queryString ? `?${queryString}` : ''}`)
}

export const getProductDetail = async (productId: number) => {
  return await handleAPI(`manage-product/product/${productId}`)
}

export const createProduct = async (data: CreateProductBodyType) => {
  return await handleAPI('manage-product/product', data, 'post')
}

export const updateProduct = async (productId: number, data: UpdateProductBodyType) => {
  return await handleAPI(`manage-product/product/${productId}`, data, 'put')
}

export const deleteProduct = async (productId: number) => {
  return await handleAPI(`manage-product/product/${productId}`, {}, 'delete')
} 