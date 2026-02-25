import * as yup from 'yup'

export const CategorySchema = yup.object({
  id: yup.number().required(),
  name: yup.string().max(255).required(),
  logo: yup.string().url().max(1000).nullable(),
  parentCategoryId: yup.number().positive().integer().nullable(),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const CategoryTranslationSchema = yup.object({
  id: yup.number().required(),
  categoryId: yup.number().positive().integer().required(),
  languageId: yup.string().min(2).max(10).required(),
  name: yup.string().min(1).max(255).required(),
  description: yup.string().optional().default(''),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const CategoryIncludeTranslationSchema = CategorySchema.shape({
  categoryTranslations: yup.array().of(CategoryTranslationSchema)
})

export const GetAllCategoriesResSchema = yup.object({
  data: yup.array(CategoryIncludeTranslationSchema),
  totalItems: yup.number().required()
})

export const GetAllCategoriesQuerySchema = yup.object({
  parentCategoryId: yup.number().positive().integer().optional()
})

export const GetCategoryParamsSchema = yup.object({
  categoryId: yup.number().positive().integer().required()
})

export const GetCategoryDetailResSchema = CategoryIncludeTranslationSchema

export const CreateCategoryBodySchema = CategorySchema.pick(['name', 'logo', 'parentCategoryId'])
  .shape({
    parentCategoryId: yup.number().positive().integer().optional()
  })
  .strict()

export type UpdateCategoryFormValues = {
  name?: string | undefined
  logo?: string | null | undefined
  parentCategoryId?: number | undefined
}

export const UpdateCategoryBodySchema = CreateCategoryBodySchema.partial()

export type CategoryType = yup.InferType<typeof CategorySchema>
export type CategoryWithTranslationsType = yup.InferType<typeof CategoryIncludeTranslationSchema>
export type GetAllCategoriesResponseType = yup.InferType<typeof GetAllCategoriesResSchema>
export type GetAllCategoriesQueryType = yup.InferType<typeof GetAllCategoriesQuerySchema>
export type GetCategoryDetailResponseType = yup.InferType<typeof GetCategoryDetailResSchema>
export type CreateCategoryBodyType = yup.InferType<typeof CreateCategoryBodySchema>
export type GetCategoryParamsType = yup.InferType<typeof GetCategoryParamsSchema>
export type UpdateCategoryBodyType = yup.InferType<typeof UpdateCategoryBodySchema>
