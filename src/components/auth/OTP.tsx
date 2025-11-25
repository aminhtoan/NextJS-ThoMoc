// src/components/auth/OTP.tsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { TypeofVerificationCode } from 'src/constants/auth'
import OTPInput from './OTPInput'

interface Datainit {
  email: string
  tempToken: string
  isRemmember: boolean
}

interface OTPProps {
  open: boolean
  data: Datainit
  handClose: () => void
}

const OTP = (props: OTPProps) => {
  const { open, data, handClose } = props
  const [otp, setOtp] = useState('')
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(59)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const router = useRouter()

  const otpdata = useMemo(
    () => ({
      email: data.email,
      type: TypeofVerificationCode.LOGIN
    }),
    [data.email]
  )

  useEffect(() => {
    if (open) {
      setIsActive(true)
      setMinutes(1)
      setSeconds(59)
    } else {
      setIsActive(false)
      setOtp('') // Reset OTP khi đóng dialog
    }
  }, [open])

  useEffect(() => {
    const sendOTP = async () => {
      await handleAPI('auth/otp', otpdata, 'post')
    }
    sendOTP()
  }, [otpdata])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        setIsActive(false)
        setMinutes(0)
        setSeconds(0)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time
  }

  const handleVerify = async () => {
    try {
      if (isLoading) return

      setIsLoading(true)

      const dataLogin = {
        tempToken: data.tempToken,
        code: otp
      }

      const user = await handleAPI('/auth/login', dataLogin, 'post')

      if (data.isRemmember) {
        localStorage.setItem('accessToken', user.data.accessToken)
      }
      toast.success('Đăng nhập thành công')
      router.push('/')
    } catch (error: any) {
      console.log('Error Login OTP: ', error)
      setError(
        error?.response?.data?.message?.[0]?.message ||
          error?.response?.data?.error ||
          error?.response?.data.message ||
          'Đã xảy ra lỗi'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await handleAPI('auth/otp', otpdata, 'post')
      setMinutes(1)
      setSeconds(59)
      setIsActive(true)
      setOtp('')
    } catch (error: any) {
      console.log('Error Resend OTP: ', error)
      toast.error(error)
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
          {error && (
            <Typography color='error' sx={{ mt: 4, fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>

        <Stack sx={{ paddingLeft: 4 }} direction='row' justifyContent='space-between' alignItems='center' width='335px'>
          <Typography>
            Time Remaining:{' '}
            <b>
              {' '}
              {formatTime(minutes)}:{formatTime(seconds)}
            </b>
          </Typography>
          <Button
            variant='text'
            onClick={handleResend}
            disabled={isActive}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              p: 0,
              opacity: isActive ? 0.5 : 1
            }}
          >
            Send again
          </Button>
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
