/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'
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
  }, [router.isReady, router.asPath, router.replace, router])

  if (authContext.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
