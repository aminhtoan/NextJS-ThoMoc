import handleAPI from 'src/apis/handleAPI'
import { GetProductsQueryType } from 'src/types/product'

export const getPublicProducts = async ({
  page,
  limit,
  name,
  brandIds,
  categories,
  minPrice,
  maxPrice,
  createdById,
  orderBy,
  sortBy
}: GetProductsQueryType) => {
  return await handleAPI(
    `product?page=${page}&limit=${limit}&name=${name || ''}&brandIds=${brandIds || ''}&categories=${categories || ''}&minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&createdById=${createdById || ''}&orderBy=${orderBy || 'desc'}&sortBy=${sortBy || 'createdAt'}`
  )
}

export const getProductDetail = async (productId: number) => {
  return await handleAPI(`product/${productId}`)
}
