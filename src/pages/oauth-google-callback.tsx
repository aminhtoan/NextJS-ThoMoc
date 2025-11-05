import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const GoogleCallback = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!router.isReady) return
    const { accessToken, refreshToken, errorMessage } = router.query

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', String(accessToken))
      localStorage.setItem('refreshToken', String(refreshToken))
      router.replace('/') // chuyển về trang chủ
    } else if (errorMessage) {
      setError(String(errorMessage))
    } else {
      router.replace('/login')
      setError('Something went wrong with Google authentication.')
    }
  }, [router])

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
