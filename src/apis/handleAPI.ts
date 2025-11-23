import axiosClient from './axiosClient'

const handleAPI = async (url: string, data?: any, method?: 'post' | 'put' | 'get' | 'delete') => {
  try {
    const response = await axiosClient({
      url, 
      method: method ?? 'get',
      data 
    })
    if (response.status == 401) {
      console.log('check ccc')
    }

    return response // Trả về dữ liệu từ API
  } catch (error: any) {
    throw error // Quản lý lỗi nếu có
  }
}

export default handleAPI
