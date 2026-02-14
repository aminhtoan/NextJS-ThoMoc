import * as yup from 'yup'

export const CreatePaymentMethodSchema = yup.object().shape({
  name: yup
    .string()
    .required('Payment method name is required')
    .max(50, 'Payment method name must be at most 50 characters'),
  code: yup.string().required('Payment method code is required'),
  isActive: yup.boolean().required('Is active status is required')
})

export const UpdatePaymentMethodSchema = yup.object().shape({
  name: yup.string().max(50, 'Payment method name must be at most 50 characters'),
  code: yup.string(),
  isActive: yup.boolean()
})

export type PaymentMethodType = yup.InferType<typeof CreatePaymentMethodSchema>
export type UpdatePaymentMethodType = yup.InferType<typeof UpdatePaymentMethodSchema>
export type CreatePaymentMethodType = yup.InferType<typeof CreatePaymentMethodSchema>
