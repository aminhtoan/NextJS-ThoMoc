// src/components/auth/OTP.tsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { OTPFormData } from 'src/types/auth'
import { useLocalStorage } from 'src/hooks/useLocalStorage'
import OTPInput from './OTPInput'

interface OTPProps {
  open: boolean
  data: OTPFormData
  handClose: () => void
}

const TOTP = (props: OTPProps) => {
  const { open, data, handClose } = props
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)
  const [, setUserData] = useLocalStorage<string | null>('userData', null)
  const router = useRouter()

  const handleVerify = async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const dataLogin = {
        tempToken: data.tempToken,
        totpCode: otp
      }

      const user = await handleAPI('/auth/login/verify', dataLogin, 'post')
      const userData = await handleAPI('auth/me')

      if (data.isRemmember) {
        setAccessToken(user.data.accessToken)
        setRefreshToken(user.data.refreshToken)
        setUserData(JSON.stringify(userData.data))
      }
      toast.success('Đăng nhập thành công')

      // Redirect logic giống OTP
      const { role } = userData.data
      const { returnUrl } = router.query
      if (returnUrl) {
        router.replace(returnUrl as string)
      } else if (role && role.name === 'ADMIN') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message?.[0]?.message ||
          error?.response?.data?.error ||
          error?.response?.data.message ||
          'Đã xảy ra lỗi'
      )
      console.log('Error Login TOTP: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOtpComplete = otp.length === 6 && /^\d{6}$/.test(otp)

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          width: 400,
          overflowY: 'unset'
        }
      }}
      disablePortal
    >
      <DialogTitle sx={{ m: 0 }}>
        <Box>
          <Typography variant='h6' component='h2' fontWeight={550} textAlign='center' sx={{ fontSize: 25 }}>
            Xác minh đăng nhập
          </Typography>

          <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ mb: 3, fontSize: 15 }}>
            Nhập bên dưới
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ paddingLeft: 4 }}>
          <Typography variant='body2' component='label' sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
            Code *
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <OTPInput length={6} onChange={val => setOtp(val)} value={otp} disabled={isLoading} />

          {error && (
            <Typography color='error' sx={{ mt: 4, fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleVerify}
          disabled={!isOtpComplete || isLoading}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TOTP
