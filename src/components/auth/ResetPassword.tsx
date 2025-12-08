import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import { ResetPasswordFormData, ResetPasswordSchema } from 'src/models/auth.model'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

interface Props {
  open: boolean
  handleClose: () => void
  data: any
  handleCloseVerifyResetCode: () => void
  handleCloseForgotPassword: () => void
}

const ResetPassword = (props: Props) => {
  const { open, handleClose, data, handleCloseVerifyResetCode, handleCloseForgotPassword } = props
  const [isLoading, setIsLoading] = useState(false)
  const [isShowNewPassword, setIsShowNewPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

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

  const handleCloseAll = () => {
    handleClose()
    handleCloseForgotPassword()
    handleCloseVerifyResetCode()
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true)
      const res = await handleAPI('/auth/reset-password', data, 'post')
      res && res.data && toast.success(res.data.message)
      handleCloseAll()
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message?.[0]?.message || 'Xảy ra lỗi mạng')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <Box onSubmit={handleSubmit(onSubmit)} component='form'>
        <DialogTitle sx={{ fontSize: '30px' }}>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Nhập New Password
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
                    type={isShowNewPassword ? 'text' : 'password'}
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
                      className: 'helper-text'
                    }}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label={isShowNewPassword ? 'hide the password' : 'display the password'}
                            onClick={() => setIsShowNewPassword(show => !show)}
                            edge='end'
                            disabled={isLoading}
                          >
                            {isShowNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </>
              )}
              name='newPassword'
            />
          </Box>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Nhập Confirm Password
          </Typography>
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
                    type={isShowConfirmPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    fullWidth
                    variant='outlined'
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    error={Boolean(errors?.confirmNewPassword)}
                    helperText={errors?.confirmNewPassword?.message}
                    FormHelperTextProps={{
                      className: 'helper-text'
                    }}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label={isShowConfirmPassword ? 'hide the password' : 'display the password'}
                            onClick={() => setIsShowConfirmPassword(show => !show)}
                            edge='end'
                            disabled={isLoading}
                          >
                            {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </>
              )}
              name='confirmNewPassword'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Đóng
          </Button>
          <Button variant='contained' type='submit'>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default ResetPassword
