import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { changePasswordAuth } from 'src/service/auth'
import { ChangePasswordBodyType, ChangePasswordSchema } from 'src/types/auth'

const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = React.useState(false)
  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const {
    handleSubmit: handleSubmitChangePassword,
    control: controlChangePassword,
    reset,
    formState: { errors: errorsChangePassword }
  } = useForm<ChangePasswordBodyType>({
    mode: 'onBlur',
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues
  })

  const onSubmit = async (data: ChangePasswordBodyType) => {
    try {
      setIsLoading(true)
      await changePasswordAuth(data.oldPassword, data.newPassword)
      toast.success(t('Updated successfully'))
      reset(defaultValues)
    } catch (error: any) {
      console.log(error)
      if (error.response?.data?.message?.[0]?.field === 'oldPassword') {
        toast.error(t('Old password is incorrect'))
        return
      }
      toast.error(error.response?.data?.message?.[0]?.message || t('Network error, please try again'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
          {t('Change Password')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <>
        {/* Label */}
        <Grid item xs={4}>
          <Typography>{t('Current Password')}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={1} gap={3} component='form' onSubmit={handleSubmitChangePassword(onSubmit)}>
            <Grid item xs={12}>
              <Controller
                name='oldPassword'
                control={controlChangePassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type='password'
                    placeholder={t('Old Password')}
                    fullWidth
                    error={!!errorsChangePassword.oldPassword}
                    helperText={errorsChangePassword.oldPassword?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='newPassword'
                control={controlChangePassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type='password'
                    placeholder={t('New Password')}
                    fullWidth
                    error={!!errorsChangePassword.newPassword}
                    helperText={errorsChangePassword.newPassword?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='confirmNewPassword'
                control={controlChangePassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type='password'
                    placeholder={t('Confirm New Password')}
                    fullWidth
                    error={!!errorsChangePassword.confirmNewPassword}
                    helperText={errorsChangePassword.confirmNewPassword?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <button
                type='submit'
                style={{
                  color: 'white',
                  backgroundColor: '#1975D1',
                  width: '80px',
                  height: '30px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500
                }}
                disabled={isLoading}
              >
                {isLoading ? t('Processing...') : t('Change')}
              </button>
            </Grid>
          </Grid>
        </Grid>
      </>
    </Grid>
  )
}

export default ChangePasswordPage
