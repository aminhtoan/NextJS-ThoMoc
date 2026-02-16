import api from 'src/apis/axiosClient'
import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

export const getMediaURL = () => {
  return handleAPI(API_CONFIG.MEDIA_API.DEFAULT_AVATAR)
}

export const uploadMedia = async (file: any, folder: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  try {
    const response = await api.post(API_CONFIG.MEDIA_API.UPLOAD_IMAGE_CLOUDINARY, formData, {
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

export const UploadManyMedia = async (files: any[], folder: string) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append(`files`, file)
  })
  formData.append('folder', folder)

  try {
    const response = await api.post(API_CONFIG.MEDIA_API.UPLOAD_IMAGES_CLOUDINARY, formData, {
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
