import * as yup from 'yup'

export const BrandSchema = yup.object({
  id: yup.number().required(),
  logo: yup.string().url().max(1000).required(),
  name: yup.string().max(500).required(),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const BrandTranslationSchema = yup.object({
  id: yup.number().required(),
  brandId: yup.number().positive().integer().required(),
  languageId: yup.string().min(2).max(10).required(),
  name: yup.string().min(1).max(500).required(),
  description: yup.string().optional().default(''),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const GetBrandsQuerySchema = yup.object({
  page: yup.number().positive().integer().required(),
  limit: yup.number().positive().integer().required(),
  search: yup.string().max(255).optional()
})

export const GetBrandDetailParamsSchema = yup.object({
  brandId: yup.number().positive().integer().required()
})

export const GetBrandDetailResSchema = BrandSchema.shape({
  brandTranslations: yup.array().of(BrandTranslationSchema)
})

export const GetBrandQueryResSchema = yup.object({
  data: yup.array(GetBrandDetailResSchema),
  page: yup.number().required(),
  limit: yup.number().required(),
  totalItems: yup.number().required(),
  totalPages: yup.number().required()
})

export const CreateBrandBodySchema = BrandSchema.pick(['logo', 'name'])
export const UpdateBrandBodySchema = BrandSchema.partial().pick(['logo', 'name'])

export type BrandType = yup.InferType<typeof BrandSchema>
export type GetBrandsQueryType = yup.InferType<typeof GetBrandsQuerySchema>
export type CreateBrandBodyType = yup.InferType<typeof CreateBrandBodySchema>
export type UpdateBrandBodyType = yup.InferType<typeof UpdateBrandBodySchema>
