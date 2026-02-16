import handleAPI from 'src/apis/handleAPI'

export const GetLanguage = async () => {
  return await handleAPI('language')
}

export const CreateLanguage = async (data: { id: string; name: string }) => {
  return await handleAPI('language', data, 'post')
}

export const UpdateLanguage = async (languageId: string, data: { name: string }) => {
  return await handleAPI(`language/${languageId}`, data, 'put')
}

export const DeleteLanguage = async (languageId: string) => {
  return await handleAPI(`language/${languageId}`, {}, 'delete')
}