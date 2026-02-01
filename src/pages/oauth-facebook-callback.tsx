import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'src/hooks/useLocalStorage'
import handleAPI from 'src/apis/handleAPI'

const FacebookCallback = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)
  const [, setUserData] = useLocalStorage<string | null>('userData', null)
  useEffect(() => {
    if (!router.isReady) return
    const run = async () => {
      const { accessToken, refreshToken, errorMessage } = router.query
      const userData = await handleAPI('auth/me')
      if (accessToken && refreshToken && !errorMessage) {
        setAccessToken(String(accessToken))
        setRefreshToken(String(refreshToken))
        setUserData(userData.data)
        await handleAPI('auth/me')
        router.replace('/')
      } else if (errorMessage) {
        setError(String(errorMessage))
      } else {
        setError('Something went wrong with Facebook authentication.')
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
        <h2>Đang xử lý đăng nhập FaceBook...</h2>
      )}
    </div>
  )
}

export default FacebookCallback
