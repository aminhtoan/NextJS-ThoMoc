import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage } from 'src/hooks/useLocalStorage'

const FacebookCallback = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)

  useEffect(() => {
    if (!router.isReady) return
    const { accessToken, refreshToken, errorMessage } = router.query

    if (accessToken && refreshToken) {
      setAccessToken(String(accessToken))
      setRefreshToken(String(refreshToken))
      router.replace('/') // chuyển về trang chủ
    } else if (errorMessage) {
      setError(String(errorMessage))
    } else {
      router.replace('/login')
      setError('Something went wrong with FaceBook authentication.')
    }
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
