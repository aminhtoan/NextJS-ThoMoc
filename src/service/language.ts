import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

export const GetLanguage = async () => {
  return await handleAPI(`${API_CONFIG.LANGUAGE.LANGUAGE}`)
}

export const CreateLanguage = async (data: { id: string; name: string }) => {
  return await handleAPI(API_CONFIG.LANGUAGE.LANGUAGE, data, 'post')
}

export const UpdateLanguage = async (languageId: string, data: { name: string }) => {
  return await handleAPI(`${API_CONFIG.LANGUAGE.LANGUAGE}/${languageId}`, data, 'put')
}

export const DeleteLanguage = async (languageId: string) => {
  return await handleAPI(`${API_CONFIG.LANGUAGE.LANGUAGE}/${languageId}`, {}, 'delete')
}
