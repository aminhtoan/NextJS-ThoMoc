import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import OTPInput from './OTPInput'
import ResetPassword from './ResetPassword'
import { TypeofVerificationCode } from 'src/constants/auth'
import OTPCountdown from './OTPCountdown'
import { ResetPasswordData } from 'src/types/auth'

interface Props {
  open: boolean
  handleClose: () => void
  data: ResetPasswordData
  handleCloseForgotPassword: () => void
}

const VerifyResetCode = (props: Props) => {
  const { open, handleClose, data, handleCloseForgotPassword } = props
  const [isLoading, setIsLoading] = useState(false)
  const [isShowresetPassword, setIsShowResetPassword] = useState(false)
  const [dataResetPassword, setDataResetPassword] = useState({})
  const [otp, setOtp] = useState('')

  useEffect(() => {
    const sendOTP = async () => {
      const otpdata = {
        email: data.email,
        type: TypeofVerificationCode.FORGOT_PASSWORD
      }
      await handleAPI('auth/otp', otpdata, 'post')
    }
    sendOTP()
  }, [data.email])

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const info = { ...data, code: otp }
      if (!data.tempToken) return toast.error('Xảy ra lỗi mạng!!!')

      const res = await handleAPI('/auth/verify-reset-code', info, 'post')
      if (res && res.data) {
        toast.success(res.data.message)
        setIsShowResetPassword(true)
        setDataResetPassword({
          tempToken: data.tempToken,
          email: data.email
        })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message?.[0]?.message || error?.response?.data?.message || 'Xảy ra lỗi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const otpdata = {
        email: data.email,
        type: TypeofVerificationCode.FORGOT_PASSWORD
      }

      // Gửi lại OTP qua API
      await handleAPI('auth/otp', otpdata, 'post')

      // Reset ô nhập OTP
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
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ fontSize: '30px' }}>Quên mật khẩu</DialogTitle>
      <DialogContent>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 2, display: 'flex', justifyContent: 'center', fontSize: '20px' }}
        >
          Nhập mã OTP để đặt lại mật khẩu
        </Typography>
        <Box sx={{ mb: 2 }}>
          <OTPInput length={6} onChange={val => setOtp(val)} value={otp} disabled={isLoading} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <OTPCountdown initialMinutes={1} initialSeconds={59} onResend={handleResend} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
          Xác nhận
        </Button>
      </DialogActions>
      <ResetPassword
        open={isShowresetPassword}
        handleClose={() => setIsShowResetPassword(false)}
        handleCloseVerifyResetCode={handleClose}
        handleCloseForgotPassword={handleCloseForgotPassword}
        data={dataResetPassword}
      />
    </Dialog>
  )
}

export default VerifyResetCode
