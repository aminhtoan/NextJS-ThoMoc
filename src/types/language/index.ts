import yup from 'yup'

export const LanguageSchema = yup.object({
  id: yup.string().min(2).max(10).required(),
  name: yup.string().max(255).required(),
  createdById: yup.number().nullable(),
  updatedById: yup.number().nullable(),
  deletedAt: yup.date().nullable(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
})

export const CreateLanguageBodySchema = LanguageSchema.pick(['id', 'name']).strict()

export const GetAllLanguagesResSchema = yup.object({
  data: yup.array(LanguageSchema),
  totalItems: yup.number().required()
})

export const GetLanguageResSchema = LanguageSchema

export const UpdateLanguageBodySchema = LanguageSchema.pick(['name']).strict()

export const GetLanguageParamsSchema = yup
  .object({
    languageId: yup.string().min(2).max(10).required()
  })
  .strict()

export type LanguageType = yup.InferType<typeof LanguageSchema>
export type CreateLanguageBodyType = yup.InferType<typeof CreateLanguageBodySchema>
export type GetAllLanguagesResType = yup.InferType<typeof GetAllLanguagesResSchema>
export type GetLanguageResType = yup.InferType<typeof GetLanguageResSchema>
export type UpdateLanguageBodyType = yup.InferType<typeof UpdateLanguageBodySchema>
export type GetLanguageParamsType = yup.InferType<typeof GetLanguageParamsSchema>
