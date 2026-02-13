import { Button } from '@mui/material'
import { useState } from 'react'
import handleAPI from 'src/apis/handleAPI'
import { FacebookIcon } from 'src/components/Icon/SitemarkIcon'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const FacebookLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true)

      const res = await handleAPI('/auth/facebook')
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
      startIcon={<FacebookIcon />}
      onClick={handleFacebookLogin}
      disabled={isLoading}
      variant='outlined'
      sx={{ borderColor: '#dadce0' }}
    >
      {isLoading ? t('Processing...') : t('Sign in with Facebook')}
    </Button>
  )
}

export default FacebookLogin
