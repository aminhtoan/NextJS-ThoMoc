// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import handleAPI from 'src/apis/handleAPI'
import { AuthValuesType, UserDataType } from './types'
import { logoutAuth } from 'src/service/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('accessToken')!
      if (storedToken) {
        setLoading(true)
        await handleAPI('auth/me')
          .then(async response => {
            setLoading(false)
            setUser(response.data)
            window.localStorage.setItem('userData', JSON.stringify(response.data))
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()

    // Listen to authDataUpdated event từ OTP hoặc components khác để update user state ngay
    const handleAuthDataUpdated = (event: any) => {
      const userData = event.detail
      if (userData) {
        setUser(userData)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('authDataUpdated', handleAuthDataUpdated)
      
      return () => {
        window.removeEventListener('authDataUpdated', handleAuthDataUpdated)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    logoutAuth({ refreshToken: window.localStorage.getItem('refreshToken') || '' }).catch(error => {
      console.error('Logout Error:', error)
    })
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)

    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
