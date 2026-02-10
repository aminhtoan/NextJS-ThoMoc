import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

export const getPermission = async () => {
  return await handleAPI(`${API_CONFIG.PERMISSION.ALL}`)
}
