import * as yup from 'yup'

export const ProductTranslationSchema = yup.object({
  id: yup.number().required(),
  productId: yup.number().required(),
  languageId: yup.string().required(),
  name: yup.string().max(500).required(),
  description: yup.string().required(),

  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedById: yup.number().nullable(),

  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const CreateProductTranslationBodySchema = yup.object().shape({
  productId: yup.number().positive().integer().required('Product is required'),
  languageId: yup.string().required('Language is required'),
  name: yup
    .string()
    .required('Translation name is required')
    .min(1, 'Name must be at least 1 character')
    .max(500, 'Name must be at most 500 characters'),
  description: yup.string().required('Description is required')
})

export const UpdateProductTranslationBodySchema = yup.object().shape({
  languageId: yup.string().optional(),
  name: yup.string().max(500).optional(),
  description: yup.string().optional()
})

export const GetProductTranslationListResSchema = yup.object({
  data: yup.array(ProductTranslationSchema).required(),
  totalItems: yup.number().required()
})

export type ProductTranslationType = yup.InferType<typeof ProductTranslationSchema>
export type CreateProductTranslationBodyType = yup.InferType<typeof CreateProductTranslationBodySchema>
export type UpdateProductTranslationBodyType = yup.InferType<typeof UpdateProductTranslationBodySchema>
export type GetProductTranslationListResType = yup.InferType<typeof GetProductTranslationListResSchema>

export interface ProductTranslationFormFields {
  languageId: string
  name: string
  description: string
}
