import * as yup from 'yup'

export interface Permission {
  id: number
  name: string
  description?: string
  path: string
  method: string
  module: string
}

export interface Role {
  id: number
  name: string
  description?: string
  isActive?: boolean
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}

export interface RoleListQuery {
  page?: number
  limit?: number
}

export interface RoleListResponse {
  data: Role[]
  total: number
  page: number
  limit: number
}

export interface CreateRoleBody {
  name: string
  description?: string
}

export interface UpdateRoleBody {
  name?: string
  description?: string
  isActive?: boolean
  permissionIds?: number[]
}

export const CreateRoleBodySchema = yup.object().shape({
  name: yup.string().required('Role name is required').max(50, 'Role name must be at most 50 characters'),
  description: yup.string().max(255, 'Description must be at most 255 characters')
})

export type CreateRoleBodyType = yup.InferType<typeof CreateRoleBodySchema>

export const UpdateRoleBodySchema = yup.object().shape({
  name: yup.string().max(50, 'Role name must be at most 50 characters'),
  description: yup.string().max(255, 'Description must be at most 255 characters'),
  isActive: yup.boolean(),
  permissionIds: yup.array().of(yup.number().integer().required())
})

export type UpdateRoleBodyType = yup.InferType<typeof UpdateRoleBodySchema>
