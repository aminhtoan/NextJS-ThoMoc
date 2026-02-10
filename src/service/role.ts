import handleAPI from 'src/apis/handleAPI'
import { CreateRoleBodyType, RoleListQuery, UpdateRoleBodyType } from 'src/types/role'
import { API_CONFIG } from 'src/configs/api'

// Lấy ra role theo id
export const getRoleById = async (id: number) => {
  return await handleAPI(`${API_CONFIG.ROLE.ROLE}/${id}`)
}

export const getAllRoles = async ({ page, limit }: RoleListQuery) => {
  return await handleAPI(`${API_CONFIG.ROLE.ROLE}?page=${page}&limit=${limit}`)
}

export const createRole = async (data: CreateRoleBodyType) => {
  return await handleAPI(`${API_CONFIG.ROLE.ROLE}`, data, 'post')
}

export const updateRole = async (id: number, data: UpdateRoleBodyType) => {
  return await handleAPI(`${API_CONFIG.ROLE.ROLE}/${id}`, data, 'put')
}

export const deleteRole = async (id: number) => {
  return await handleAPI(`${API_CONFIG.ROLE.ROLE}/${id}`, undefined, 'delete')
}
