import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { ForgotPasswordFormData, ForgotPasswordSchema } from 'src/models/auth.model'
import VerifyResetCode from './VerifyResetCode'

interface Props {
  open: boolean
  handleClose: () => void
}
const helperTextStyle = {
  color: 'error.main',
  fontSize: '0.8rem',
  fontWeight: 500,
  mt: 0.5,
  fontFamily: 'Poppins'
}

interface ResetPasswordData {
  email: string
  tempToken: string
}
const ForgotPassword = (props: Props) => {
  const { open, handleClose } = props
  const [isLoading, setIsLoading] = useState(false)
  const [isShowVerify, setIsShowVerify] = useState(false)
  const [data, setData] = useState<ResetPasswordData | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(ForgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      const res = await handleAPI('/auth/forgot-password', data, 'post')
      console.log(res.data)
      if (res && res.data) {
        setIsShowVerify(true)
        setData({
          tempToken: res.data.tempToken,
          email: data.email
        })
      }
      console.log(res)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Xảy ra lỗi')
    } finally {
      setIsLoading(false)
    }
  }
  console.log(data)
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <Box onSubmit={handleSubmit(onSubmit)} component='form'>
        <DialogTitle sx={{ fontSize: '30px' }}>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Nhập email của bạn để đặt lại mật khẩu
          </Typography>
          <Box>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    id='email'
                    label='Email'
                    name='email'
                    placeholder='your@email.com'
                    autoComplete='email'
                    autoFocus
                    required
                    fullWidth
                    variant='outlined'
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    error={Boolean(errors?.email)}
                    helperText={errors?.email?.message}
                    FormHelperTextProps={{
                      sx: helperTextStyle
                    }}
                    disabled={isLoading}
                  />
                </>
              )}
              name='email'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button variant='contained' type='submit'>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Box>
      {data && (
        <VerifyResetCode
          open={isShowVerify}
          handleClose={() => setIsShowVerify(false)}
          data={data}
          handleCloseForgotPassword={handleClose}
        />
      )}
    </Dialog>
  )
}

export default ForgotPassword
