import handleAPI from 'src/apis/handleAPI'
import { CreateUserBodyType, UserListResponse } from 'src/types/user'

export const fetchUsers = async (page: number, limit: number): Promise<UserListResponse> => {
  const response = await handleAPI(`/users?page=${page}&limit=${limit}`)

  return response.data
}

export const createUser = async (data: CreateUserBodyType): Promise<void> => {
  await handleAPI('/users', data, 'post')
}
