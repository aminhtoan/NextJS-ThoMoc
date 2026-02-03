import { EMAIL_REG, PASSWORD_REG, PHONE_REG } from 'src/configs/regex'
import * as yup from 'yup'

export const LoginSchema = yup
  .object({
    email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
    password: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  })
  .required()

export const ForgotPasswordSchema = yup
  .object({
    email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`)
  })
  .required()

export const ResetPasswordSchema = ForgotPasswordSchema.shape({
  tempToken: yup.string().required(),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmNewPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
}).required()

export const RegisterBodySchema = yup
  .object({
    email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
    password: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    name: yup.string().required('Vui lòng nhập tên'),
    confirmPassword: yup
      .string()
      .required('Vui lòng xác nhận mật khẩu')
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
    phoneNumber: yup
      .string()
      .required('Vui lòng nhập số điện thoại')
      .matches(PHONE_REG, 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 số'),
    code: yup.string()
  })
  .required()

export const ResetPasswordData = ForgotPasswordSchema.shape({
  tempToken: yup.string().required()
})

export const OTPSChema = yup.object({
  email: yup.string(),
  tempToken: yup.string(),
  isRemmember: yup.boolean()
})

export const loginVerify = yup.object({
  tempToken: yup.string().required(),
  code: yup.string().required()
})

export const RefreshTokenBodyDTO = yup.object({
  refreshToken: yup.string().required()
})

export  const VerifyOTP = yup.object({
  email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
  code: yup.string().required('Vui lòng nhập mã OTP').length(6, 'Mã OTP gồm 6 chữ số').max(6, 'Mã OTP gồm 6 chữ số')
})

export type VerifyOTPType = yup.InferType<typeof VerifyOTP>
export type RegisterBodyType = yup.InferType<typeof RegisterBodySchema>
export type RefreshTokenBodyData = yup.InferType<typeof RefreshTokenBodyDTO>
export type ResetPasswordData = yup.InferType<typeof ResetPasswordData>
export type OTPFormData = yup.InferType<typeof OTPSChema>
export type LoginFormData = yup.InferType<typeof LoginSchema>
export type ForgotPasswordFormData = yup.InferType<typeof ForgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof ResetPasswordSchema>
export type LoginVerifyFormData = yup.InferType<typeof loginVerify>
