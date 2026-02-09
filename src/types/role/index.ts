export interface Role {
  id: number
  name: string
  description?: string
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
}
