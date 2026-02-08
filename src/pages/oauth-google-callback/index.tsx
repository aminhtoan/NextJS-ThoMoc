import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { useLocalStorage } from 'src/hooks/useLocalStorage'
import { authMe } from 'src/service/auth'

const GoogleCallback = () => {
  const { t } = useTranslation()
  const { setUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)

  useEffect(() => {
    if (!router.isReady) return
    const run = async () => {
      const { accessToken: tokenFromQuery, refreshToken: refreshTokenFromQuery, errorMessage } = router.query
      if (tokenFromQuery && refreshTokenFromQuery && !errorMessage) {
        // Lưu token vào localStorage trước
        setAccessToken(String(tokenFromQuery))
        setRefreshToken(String(refreshTokenFromQuery))

        // Đợi localStorage được cập nhật, sau đó gọi authMe
        setTimeout(async () => {
          try {
            const user = await authMe()
            setUser(user.data)
            if (user.data.role.name === 'ADMIN') {
              router.replace('/admin')
            } else {
              router.replace('/')
            }
          } catch (err) {
            setError(t('Cannot fetch user information. Please try again.'))
          }
        }, 100)
      } else if (errorMessage) {
        setError(String(errorMessage))
      } else {
        setError(t('Something went wrong with Google authentication. Please try again.'))
        router.replace('/login')
      }
    }

    run()
  }, [router, setAccessToken, setRefreshToken, setUser, t])

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
        <h2>{t('Processing Google login...')}</h2>
      )}
    </div>
  )
}

export default GoogleCallback
