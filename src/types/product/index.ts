import * as yup from 'yup'

const GetProductsQuerySchema = yup.object().shape({
  page: yup.number().positive().integer().default(1),
  limit: yup.number().positive().integer().default(10),
  name: yup.string().optional(),
  brandIds: yup
    .mixed()
    .transform(value => {
      if (typeof value === 'string') {

        return value.split(',').map(id => Number(id))
      } else if (Array.isArray(value)) {
        
        return value.map(id => Number(id))
      }

      return []
    })
    .optional(),
  categories: yup
    .mixed()
    .transform(value => {
      if (typeof value === 'string') {
        return value.split(',').map(id => Number(id))
      } else if (Array.isArray(value)) {
        return value.map(id => Number(id))
      }

      return []
    })
    .optional(),
  minPrice: yup.number().positive().optional(),
  maxPrice: yup.number().positive().optional(),
  createdById: yup.number().positive().integer().optional(),
  orderBy: yup.mixed<'asc' | 'desc'>().oneOf(['asc', 'desc']).default('desc'),
  sortBy: yup.mixed<'price' | 'createdAt' | 'sale'>().oneOf(['price', 'createdAt', 'sale']).default('createdAt')
})

export type GetProductsQueryType = yup.InferType<typeof GetProductsQuerySchema>

export const GetManagerProductsQuerySchema = GetProductsQuerySchema.shape({
  isPublic: yup
    .mixed()
    .transform(value => value === 'true')
    .optional(),
  createdById: yup.number().positive().integer()
})

export const GetProductParamsSchema = yup.object({
  productId: yup.number().positive().integer().required()
})

export const ProductSchema = yup.object({
  id: yup.number().required(),
  publishedAt: yup.string().nullable(),
  name: yup.string().max(500).required(),
  basePrice: yup.number().min(0).required(),
  virtualPrice: yup.number().min(0).required(),
  brandId: yup.number().positive().required(),
  images: yup.array().of(yup.string()).required(),
  variants: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required(),
        options: yup.array().of(yup.string()).required()
      })
    )
    .required(),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export type ProductType = yup.InferType<typeof ProductSchema>
export type GetManagerProductsQueryType = yup.InferType<typeof GetManagerProductsQuerySchema>
export type GetProductParamsType = yup.InferType<typeof GetProductParamsSchema>

export const EditProductBodySchema = ProductSchema.pick([
  'publishedAt',
  'name',
  'basePrice',
  'virtualPrice',
  'brandId',
  'images',
  'variants'
])

export const VariantSchema = yup.object({
  value: yup.string().required(),
  options: yup.array().of(yup.string()).required()
})

export const VariantsSchema = yup.array().of(VariantSchema)

export const GetProductsResSchema = yup.object({
  data: yup.array(
    ProductSchema.shape({
      productTranslations: yup.array().of(yup.object({})) // TODO: define ProductTranslationSchema
    })
  ),
  totalItems: yup.number().required(),
  page: yup.number().required(),
  limit: yup.number().required(),
  totalPages: yup.number().required()
})

export const GetProductDetailResSchema = ProductSchema.shape({
  productTranslations: yup.array().of(yup.object({})), // TODO: define ProductTranslationSchema
  skus: yup.array().of(yup.object({})), // TODO: define SKUSchema
  categories: yup.array().of(yup.object({})), // TODO: define CategoryIncludeTranslationSchema
  brand: yup.object({}) // TODO: define GetBrandDetailResSchema
})

export const ProductFormSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .min(1, 'Product name must be at least 1 character')
    .max(500, 'Product name must be at most 500 characters'),
  basePrice: yup.number().min(0).required('Base price is required').typeError('Base price must be a number'),
  virtualPrice: yup.number().min(0).required('Virtual price is required').typeError('Virtual price must be a number'),
  brandId: yup.string().required('Brand is required'),
  categoryIds: yup.array().of(yup.string().required()).default([]),
  isPublished: yup.boolean().default(true),
  publishedAt: yup.string().nullable().default(null)
})

export interface ProductFormFields {
  name: string
  basePrice: number
  virtualPrice: number
  brandId: string
  categoryIds: string[]
  isPublished: boolean
  publishedAt: string | null
}

export const CreateProductBodySchema = ProductSchema.pick([
  'publishedAt',
  'name',
  'basePrice',
  'virtualPrice',
  'brandId',
  'images',
  'variants'
]).shape({
  categories: yup.array().of(yup.number().positive().integer()),
  skus: yup.array().of(
    yup.object({
      value: yup.string().required(),
      price: yup.number().min(0).required(),
      stock: yup.number().min(0).required(),
      image: yup.string().optional()
    })
  )
})

export const UpdateProductBodySchema = CreateProductBodySchema

export type VariantsType = yup.InferType<typeof VariantsSchema>
export type GetProductsResType = yup.InferType<typeof GetProductsResSchema>
export type GetProductDetailResType = yup.InferType<typeof GetProductDetailResSchema>
export type CreateProductBodyType = yup.InferType<typeof CreateProductBodySchema>
export type UpdateProductBodyType = yup.InferType<typeof UpdateProductBodySchema>

export interface SKUItem {
  value: string
  price: number
  stock: number
  image: string
}
