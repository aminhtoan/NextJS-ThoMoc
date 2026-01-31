import handleAPI from 'src/apis/handleAPI'

// Lấy ra role theo id
export const getRoleById = async (id: number) => {
  return await handleAPI(`/role/${id}`, id)
}
