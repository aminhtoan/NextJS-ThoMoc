import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import { CreateUserBodyType, UpdateUserBodyType, UserListResponse } from 'src/types/user'

export const fetchUsers = async (page: number, limit: number): Promise<UserListResponse> => {
  const response = await handleAPI(`${API_CONFIG.USERS.USERS}?page=${page}&limit=${limit}`)

  return response.data
}

export const createUser = async (data: CreateUserBodyType): Promise<void> => {
  await handleAPI(API_CONFIG.USERS.USERS, data, 'post')
}

export const updateUser = async (id: number, data: UpdateUserBodyType) => {
  return await handleAPI(`${API_CONFIG.USERS.USERS}/${id}`, data, 'put')
}

export const getUserById = async (id: number) => {
  return await handleAPI(`${API_CONFIG.USERS.USERS}/${id}`)
}
export const deleteUser = async (id: number) => {
  return await handleAPI(`${API_CONFIG.USERS.USERS}/${id}`, {}, 'delete')
}
