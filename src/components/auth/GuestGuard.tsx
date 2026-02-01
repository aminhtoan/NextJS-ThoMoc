/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { clearLocalStorage } from 'src/helpers/localstorge'
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props

  const authContext = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    if (window.localStorage.getItem('accessToken') && window.localStorage.getItem('userData')) {
      if (router.asPath !== '/') {
        router.replace('/')
      }
    }
  }, [router.route])

  if (authContext.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
