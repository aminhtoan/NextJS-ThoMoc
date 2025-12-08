import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import OTPInput from './OTPInput'
import ResetPassword from './ResetPassword'
import { TypeofVerificationCode } from 'src/constants/auth'

interface Props {
  open: boolean
  handleClose: () => void
  data: any
  handleCloseForgotPassword: () => void
}

const VerifyResetCode = (props: Props) => {
  const { open, handleClose, data, handleCloseForgotPassword } = props
  const [isLoading, setIsLoading] = useState(false)
  const [isShowresetPassword, setIsShowResetPassword] = useState(false)
  const [dataResetPassword, setDataResetPassword] = useState({})
  const [otp, setOtp] = useState('')

  useEffect(() => {
    console.log(data)
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
      console.log(error)
      toast.error(error?.response?.data?.message || 'Xảy ra lỗi')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ fontSize: '30px' }}>Quên mật khẩu</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Nhập mã OTP để đặt lại mật khẩu
        </Typography>
        <Box>
          <OTPInput length={6} onChange={val => setOtp(val)} value={otp} disabled={isLoading} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Đóng
        </Button>
        <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
          Gửi yêu cầu
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
