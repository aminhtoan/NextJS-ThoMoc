import api from 'src/apis/axiosClient'
import handleAPI from 'src/apis/handleAPI'
export const getMediaURL = () => {
  return handleAPI('/media/default-avatar')
}

export const uploadMedia = async (file: any, folder: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  try {
    const response = await api.post('/media/image/cloudinary', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
