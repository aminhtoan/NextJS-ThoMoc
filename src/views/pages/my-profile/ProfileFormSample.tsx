import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Avatar,
  Grid
} from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RegisterBodySchema, RegisterBodyType } from 'src/types/auth'

/* ===== Row chuẩn Shopee ===== */
const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Grid item xs={12}>
    <Grid container alignItems='center'>
      {/* Label */}
      <Grid item sx={{ width: 140, color: 'text.secondary' }}>
        {label}
      </Grid>

      {/* Content */}
      <Grid item sx={{ flex: 1 }}>
        {children}
      </Grid>
    </Grid>
  </Grid>
)

const ProfileFormSample = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const { t } = useTranslation()
  const defaultValues: RegisterBodyType = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    code: ''
  }

  const {
    control,
    formState: { errors }
  } = useForm<RegisterBodyType>({
    defaultValues,
    resolver: yupResolver(RegisterBodySchema)
  })

  return (
    <Paper
      sx={{
        p: 4,
        mt: 3,
        borderRadius: 2
      }}
    >
      {/* ===== Header ===== */}
      <Typography variant='h5' fontWeight={700} mb={1}>
        {t('My Profile')}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={3}>
        {t('ManageInfo')}
      </Typography>

      <Divider sx={{ mb: 10, mt: 5 }} />

      {/* ===== Content ===== */}
      <Box sx={{ display: 'flex', gap: 6, mt: 4 }}>
        {/* ===== LEFT: FORM ===== */}
        <Box sx={{ flex: 8, display: 'flex', justifyContent: 'center' }}>
          <Grid
            container
            spacing={3}
            sx={{
              width: '100%',
              maxWidth: 700,
              gap: 3
              //   ml: 'auto'
            }}
          >
            {/* NAME */}
            <FormRow label={t('Name')}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    placeholder='Nguyễn Văn A'
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormRow>

            {/* EMAIL */}
            <FormRow label={t('Email')}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type='email'
                    placeholder='your@email.com'
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </FormRow>

            {/* PHONE    */}
            <FormRow label={t('Phone')}>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type='tel'
                    placeholder='0123456789'
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </FormRow>

            {/* PASSWORD */}
            <FormRow label={t('Password')}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size='small'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••'
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton size='small' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </FormRow>

            {/* BUTTON */}
            <Grid item xs={12}>
              <Grid container>
                <Grid item sx={{ width: 140 }} />
                <Grid item>
                  <Button
                    variant='contained'
                    sx={{
                      px: 4,
                      bgcolor: '#ee4d2d',
                      '&:hover': { bgcolor: '#d73211' }
                    }}
                  >
                    {t('Save')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider orientation='vertical' flexItem />

        {/* ===== RIGHT: AVATAR ===== */}
        <Box
          sx={{
            flex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Avatar sx={{ width: 100, height: 100 }} />
          <Button variant='outlined' size='small'>
            {t('ChangeImage')}
          </Button>
          <Typography variant='caption' color='text.secondary'>
            {t('FileSize')}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {t('FileExtension')}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default ProfileFormSample
