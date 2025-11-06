import { Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import handleAPI from 'src/apis/handleAPI'
import { GoogleIcon } from '../Icon/SitemarkIcon'

const GoogleLogin = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const res = await handleAPI('/auth/google-link')
      if (res?.data?.url) {
        router.push(res.data.url)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      variant='outlined'
      startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
      sx={{ borderColor: '#dadce0' }}
    >
      {isLoading ? 'Đang kết nối...' : 'Sign in with Google'}
    </Button>
  )
}

export default GoogleLogin
