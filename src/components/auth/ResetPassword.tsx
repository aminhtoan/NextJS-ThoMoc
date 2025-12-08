import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import VerifyResetCode from './VerifyResetCode'
import { ResetPasswordFormData, ResetPasswordSchema } from 'src/models/auth.model'
import { useRouter } from 'next/router'

interface Props {
  open: boolean
  handleClose: () => void
  data: any
  handleCloseVerifyResetCode: () => void
  handleCloseForgotPassword: () => void
}
const helperTextStyle = {
  color: 'error.main',
  fontSize: '0.8rem',
  fontWeight: 500,
  mt: 0.5,
  fontFamily: 'Poppins'
}
const ResetPassword = (props: Props) => {
  const { open, handleClose, data, handleCloseVerifyResetCode, handleCloseForgotPassword } = props
  const [isLoading, setIsLoading] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      tempToken: data.tempToken,
      newPassword: '',
      confirmNewPassword: '',
      email: data.email
    },
    mode: 'onBlur',
    resolver: yupResolver(ResetPasswordSchema)
  })

  useEffect(() => {
    reset({
      tempToken: data.tempToken,
      email: data.email,
      newPassword: '',
      confirmNewPassword: ''
    })
  }, [data, reset])

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const res = await handleAPI('/auth/reset-password', data, 'post')
      res && res.data && toast.success(res.data.message)
      console.log(res)
      handleClose()
      handleCloseForgotPassword()
      handleCloseVerifyResetCode()
    } catch (error: any) {
      console.log(error)
    }
  }
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <Box onSubmit={handleSubmit(onSubmit)} component='form'>
        <DialogTitle sx={{ fontSize: '30px' }}>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Nhập password
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    id='newPassword'
                    label='New Password'
                    name='newPassword'
                    placeholder='*******'
                    autoFocus
                    required
                    fullWidth
                    variant='outlined'
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    error={Boolean(errors?.newPassword)}
                    helperText={errors?.newPassword?.message}
                    FormHelperTextProps={{
                      sx: helperTextStyle
                    }}
                    disabled={isLoading}
                  />
                </>
              )}
              name='newPassword'
            />
          </Box>

          <Box>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField
                    id='confirmNewPassword'
                    label='Confirm Password'
                    name='confirmNewPassword'
                    placeholder='*******'
                    autoFocus
                    required
                    fullWidth
                    variant='outlined'
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    error={Boolean(errors?.confirmNewPassword)}
                    helperText={errors?.confirmNewPassword?.message}
                    FormHelperTextProps={{
                      sx: helperTextStyle
                    }}
                    disabled={isLoading}
                  />
                </>
              )}
              name='confirmNewPassword'
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
    </Dialog>
  )
}

export default ResetPassword
