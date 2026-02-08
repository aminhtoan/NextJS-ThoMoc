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

export const EmailSchema = yup
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

export const VerifyOTP = yup.object({
  email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
  code: yup.string().required('Vui lòng nhập mã OTP').length(6, 'Mã OTP gồm 6 chữ số').max(6, 'Mã OTP gồm 6 chữ số'),
  type: yup.string().required('Vui lòng nhập loại mã OTP')
})

export const UpdateMyProfileBodySchema = yup.object({
  email: yup
    .string()
    .nullable()
    .optional()
    .test('email-or-empty', 'Vui lòng nhập email', value => {
      // Nếu có giá trị thì validate, không thì bỏ qua
      if (value && value !== '') {
        return EMAIL_REG.test(value)
      }

      return true
    })
    .matches(EMAIL_REG, 'Địa chỉ email không hợp lệ'),

  name: yup
    .string()
    .nullable()
    .optional()
    .test('name-or-empty', 'Vui lòng nhập tên', value => {
      if (value && value !== '') {
        return value.length > 0
      }

      return true
    }),

  phoneNumber: yup
    .string()
    .nullable()
    .optional()
    .test('phone-or-empty', 'Vui lòng nhập số điện thoại', value => {
      if (value && value !== '') {
        return PHONE_REG.test(value)
      }

      return true
    })
    .matches(PHONE_REG, 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 số'),

  avatar: yup.string().nullable().optional(),

  password: yup
    .string()
    .nullable()
    .optional()
    .test('password-or-empty', 'Vui lòng nhập mật khẩu', value => {
      if (value && value !== '' && value !== '**********') {
        return PASSWORD_REG.test(value) && value.length >= 6
      }

      return true
    })
    .matches(PASSWORD_REG, 'Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export const OtpSchema = yup.object({
  code: yup
    .string()
    .required('Vui lòng nhập mã OTP')
    .matches(/^\d{6}$/, 'OTP phải là 6 chữ số')
})

export const ChangePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu cũ')
    .matches(PASSWORD_REG, 'Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .matches(PASSWORD_REG, 'Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được giống mật khẩu cũ'),

  confirmNewPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được giống mật khẩu cũ')
})

export type ChangePasswordBodyType = yup.InferType<typeof ChangePasswordSchema>
export type OtpType = yup.InferType<typeof OtpSchema>
export type UpdateMyProfileBodyType = yup.InferType<typeof UpdateMyProfileBodySchema>
export type VerifyOTPType = yup.InferType<typeof VerifyOTP>
export type RegisterBodyType = yup.InferType<typeof RegisterBodySchema>
export type RefreshTokenBodyType = yup.InferType<typeof RefreshTokenBodyDTO>
export type ResetPasswordData = yup.InferType<typeof ResetPasswordData>
export type OTPFormData = yup.InferType<typeof OTPSChema>
export type LoginFormData = yup.InferType<typeof LoginSchema>
export type ForgotPasswordFormData = yup.InferType<typeof ForgotPasswordSchema>
export type ResetPasswordFormData = yup.InferType<typeof ResetPasswordSchema>
export type LoginVerifyFormData = yup.InferType<typeof loginVerify>
export type EmailType = yup.InferType<typeof EmailSchema>
