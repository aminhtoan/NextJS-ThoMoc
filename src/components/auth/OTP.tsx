// src/components/auth/OTP.tsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { TypeofVerificationCode } from 'src/constants/auth'
import OTPCountdown from './OTPCountdown'
import OTPInput from './OTPInput'
import { loginVerify } from 'src/service/auth'
import { OTPFormData } from 'src/types/auth'
import { useLocalStorage } from 'src/hooks/useLocalStorage'

interface OTPProps {
  open: boolean
  data: OTPFormData
  handClose: () => void
}

const OTP = (props: OTPProps) => {
  const { open, data, handClose } = props
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)
  const router = useRouter()

  const otpdata = useMemo(
    () => ({
      email: data.email,
      type: TypeofVerificationCode.LOGIN
    }),
    [data.email]
  )

  useEffect(() => {
    const sendOTP = async () => {
      await handleAPI('auth/otp', otpdata, 'post')
    }
    sendOTP()
  }, [otpdata])

  const handleVerify = async () => {
    try {
      if (isLoading) return

      setIsLoading(true)

      const dataLogin = {
        tempToken: data.tempToken || '',
        code: otp
      }

      const user = await loginVerify(dataLogin)

      if (data.isRemmember) {
        setAccessToken(user.data.accessToken)
        setRefreshToken(user.data.refreshToken)
      }
      toast.success('Đăng nhập thành công')
      router.push('/')
    } catch (error: any) {
      console.log('Error Login OTP: ', error)
      toast.error(
        error?.response?.data?.message?.[0]?.message ||
          error?.response?.data?.error ||
          error?.response?.data.message ||
          'Đã xảy ra lỗi'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isOtpComplete = otp.length === 6 && /^\d{6}$/.test(otp)

  const handleResend = async () => {
    try {
      const otpdata = {
        email: data.email,
        type: TypeofVerificationCode.FORGOT_PASSWORD
      }

      await handleAPI('auth/otp', otpdata, 'post')

      setOtp('')

      toast.success('OTP đã được gửi lại')
    } catch (error: any) {
      console.log('Error Resend OTP: ', error)
      toast.error(
        error?.response?.data?.message?.[0]?.message || error?.response?.data?.message || 'Gửi lại OTP thất bại'
      )
    }
  }

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          width: 400,
          overflowY: 'unset'
        }
      }}
    >
      <DialogTitle sx={{ m: 0 }}>
        <Box>
          <Typography variant='h6' component='h2' fontWeight={550} textAlign='center' sx={{ fontSize: 25 }}>
            We've sent a code
          </Typography>

          <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ mb: 3, fontSize: 15 }}>
            Enter it below
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
        </Box>
        <Stack sx={{ paddingLeft: 4 }} direction='row' justifyContent='space-between' alignItems='center' width='335px'>
          <OTPCountdown initialMinutes={1} initialSeconds={59} onResend={handleResend} />
        </Stack>
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

export default OTP
