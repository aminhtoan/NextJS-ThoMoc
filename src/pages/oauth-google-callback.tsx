import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'src/hooks/useLocalStorage'

const GoogleCallback = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)

  useEffect(() => {
    if (!router.isReady) return
    const run = async () => {
      const { accessToken, refreshToken, errorMessage } = router.query
      if (accessToken && refreshToken && !errorMessage) {
        setAccessToken(String(accessToken))
        setRefreshToken(String(refreshToken))

        setTimeout(() => {
          router.replace('/')
        }, 100)
      } else if (errorMessage) {
        setError(String(errorMessage))
      } else {
        setError('Something went wrong with Google authentication.')
        router.replace('/login')
      }
    }

    run()
  }, [router, setAccessToken, setRefreshToken])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'sans-serif'
      }}
    >
      {error ? (
        <>
          <p>{error}</p>
        </>
      ) : (
        <h2>Đang xử lý đăng nhập Google...</h2>
      )}
    </div>
  )
}

export default GoogleCallback
