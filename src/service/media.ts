import handleAPI from 'src/apis/handleAPI'

export const getMediaURL = () => {
  return handleAPI('/media/default-avatar')
}
