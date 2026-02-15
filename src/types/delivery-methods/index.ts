import * as yup from 'yup'

export const CreateDeliveryMethodSchema = yup.object().shape({
  name: yup
    .string()
    .required('Delivery method name is required')
    .max(50, 'Delivery method name must be at most 50 characters'),
  code: yup.string().required('Delivery method code is required'),
  price: yup.number().required('Delivery method price is required').min(0, 'Price must be at least 0'),
  description: yup.string().max(255, 'Description must be at most 255 characters'),
  isActive: yup.boolean().required('Is active status is required')
})

export const UpdateDeliveryMethodSchema = yup.object().shape({
  name: yup.string().max(50, 'Delivery method name must be at most 50 characters'),
  code: yup.string(),
  price: yup.number().min(0, 'Price must be at least 0'),
  description: yup.string().max(255, 'Description must be at most 255 characters'),
  isActive: yup.boolean()
})

export type DeliveryMethodType = yup.InferType<typeof CreateDeliveryMethodSchema>
export type UpdateDeliveryMethodType = yup.InferType<typeof UpdateDeliveryMethodSchema>
export type CreateDeliveryMethodType = yup.InferType<typeof CreateDeliveryMethodSchema>
