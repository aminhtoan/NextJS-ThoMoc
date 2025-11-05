import { EMAIL_REG } from 'src/configs/regex'
import * as yup from 'yup'

export const LoginSchema = yup
  .object({
    email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
    password: yup.string().required('Vui lòng nhập mật khẩu')

    // .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
    // .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  })
  .required()

export type LoginFormData = yup.InferType<typeof LoginSchema>
