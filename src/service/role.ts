import handleAPI from 'src/apis/handleAPI'
import { RoleListQuery } from 'src/types/role'

// Lấy ra role theo id
export const getRoleById = async (id: number) => {
  return await handleAPI(`/role/${id}`, id)
}

export const getAllRoles = async ({ page, limit }: RoleListQuery) => {
  return await handleAPI(`/role?page=${page}&limit=${limit}`)
}
