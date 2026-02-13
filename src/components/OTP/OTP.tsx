// src/components/auth/OTP.tsx
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { TypeofVerificationCode } from 'src/configs/auth'
import { clearLocalStorage } from 'src/helpers/localstorge'
import { useLocalStorage } from 'src/hooks/useLocalStorage'
import { authMe, loginVerify, sentOTP } from 'src/service/auth'
import { OTPFormData } from 'src/types/auth'
import OTPCountdown from './OTPCountdown'
import OTPInput from './OTPInput'
import { useTranslation } from 'react-i18next'

interface OTPProps {
  open: boolean
  data: OTPFormData
  handClose: () => void
}

const OTP = (props: OTPProps) => {
  const { t } = useTranslation()
  const { open, data, handClose } = props
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null)
  const [, setUserData] = useLocalStorage<string | null>('userData', null)
  const [authReady, setAuthReady] = useState(false)

  const router = useRouter()
  const { returnUrl } = router.query

  const otpdata = useMemo(
    () => ({
      email: data.email,
      type: TypeofVerificationCode.LOGIN
    }),
    [data.email]
  )

  useEffect(() => {
    if (!authReady) return

    if (returnUrl) {
      router.replace(returnUrl as string)
    } else {
      router.replace('/')
    }
  }, [authReady, returnUrl, router.replace, router])

  useEffect(() => {
    if (!accessToken) return

    const bootstrapAuth = async () => {
      try {
        const res = await authMe()
        setUserData(res.data)

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authDataUpdated', { detail: res.data }))
        }

        if (res.data.role.name === 'ADMIN') {
          router.replace('/admin')
        } else {
          setAuthReady(true)
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        toast.error(t('Failed to retrieve user information. Please log in again.'))
        clearLocalStorage()
        handClose()
      }
    }

    bootstrapAuth()
  }, [accessToken, setUserData, handClose, router.replace, t, router])

  useEffect(() => {
    const sendOTP = async () => {
      await handleAPI('auth/otp', otpdata, 'post')
    }
    sendOTP()
  }, [open, otpdata])

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
      } else {
        setAccessToken(user.data.accessToken)
      }

      toast.success(t('Login Successful'))
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message?.[0]?.message ||
          error?.response?.data?.error ||
          error?.response?.data.message ||
          t('An error occurred')
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
        type: TypeofVerificationCode.LOGIN
      }

      await sentOTP(otpdata.email!, otpdata.type)

      setOtp('')

      toast.success(t('OTP has been sent to your email'))
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message?.[0]?.message || error?.response?.data?.message || t('Failed to resend OTP')
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
