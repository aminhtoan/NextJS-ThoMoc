import { EMAIL_REG, PASSWORD_REG, PHONE_REG } from 'src/configs/regex'
import { Role } from 'src/types/role'
import * as yup from 'yup'
import { STATUS } from '../other'

export interface User {
  id: number
  email: string
  name: string
  avatar?: string
  phoneNumber?: string
  roleId?: number
  role: Role
  createdAt: string
  updatedAt?: string
  status?: string
}

export interface UserListResponse {
  data: User[]
  total: number
  totalItems: number
  totalPages: number
  page: number
  limit: number
}

export interface UserTableRow {
  id: number
  email: string
  name: string
  avatar?: string
  phoneNumber?: string
  roleName: string
  roleId?: number
  status?: string
  actions?: string
}

export const CreateUserBodySchema = yup.object().shape({
  email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
  name: yup.string().required('User name is required').max(50, 'User name must be at most 50 characters'),
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(PHONE_REG, 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 số'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  roleId: yup.number().required('Vui lòng chọn vai trò cho người dùng'),
  status: yup.string().oneOf(STATUS).required('Vui lòng chọn trạng thái người dùng')
})

export type CreateUserBodyType = yup.InferType<typeof CreateUserBodySchema>
