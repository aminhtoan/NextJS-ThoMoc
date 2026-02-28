import handleAPI from 'src/apis/handleAPI'
import { GetProductsQueryType } from 'src/types/product'

export const getPublicProducts = async (query: GetProductsQueryType) => {
  const params = new URLSearchParams()

  // Chỉ thêm params khi có giá trị
  if (query.page) params.append('page', query.page.toString())
  if (query.limit) params.append('limit', query.limit.toString())
  if (query.name) params.append('name', query.name)

  // Xử lý brandIds array
  if (query.brandIds) {
    if (Array.isArray(query.brandIds)) {
      query.brandIds.forEach(id => params.append('brandIds', id.toString()))
    } else {
      // Nếu là number thì chuyển thành array hoặc append trực tiếp
      params.append('brandIds', query.brandIds.toString())
    }
  }

  if (query.categories) {
    if (Array.isArray(query.categories)) {
      query.categories.forEach(id => params.append('categories', id.toString()))
    } else {
      params.append('categories', query.categories.toString())
    }
  }

  if (query.minPrice) params.append('minPrice', query.minPrice.toString())
  if (query.maxPrice) params.append('maxPrice', query.maxPrice.toString())
  if (query.createdById) params.append('createdById', query.createdById.toString())

  const queryString = params.toString()

  return await handleAPI(`product?${queryString}`)
}

export const getProductDetail = async (productId: number) => {
  return await handleAPI(`product/${productId}`)
}

// Get SKU detail by ID
export const getSKUDetail = async (skuId: number) => {
  return await handleAPI(`product/sku/${skuId}`)
}
