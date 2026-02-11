export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  email: string
  name: string
  phoneNumber: string
  roleId: number
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  avatar: string
  createdAt: string
  createdById: number | null
  updatedAt: string
  role: {
    id: number
    name: string
    permissions: {
      id: number
      path: string
      method: string
      module: string
    }[]
  }
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
}
