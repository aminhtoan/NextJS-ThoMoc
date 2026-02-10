/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'
import { clearLocalStorage } from 'src/helpers/localstorge'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady === false) return

    if (authContext.user === null && !window.localStorage.getItem('accessToken')) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
      authContext.setUser(null)
      clearLocalStorage()
    }
  }, [router, authContext])

  // Show fallback only while auth state is loading. Returning fallback
  // when `user === null` causes an indefinite spinner for unauthenticated users.
  // Avoid accessing `window` during server-side rendering.
  if (authContext.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
