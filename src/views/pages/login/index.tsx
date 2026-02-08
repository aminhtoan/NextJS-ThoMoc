import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography
} from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SignInContainer from 'src/components/sign-in/SignInContainer'
import { loginAuth } from 'src/service/auth'
import CarCustomCard from '../../../components/sign-in/CustomCard'
import { LoginFormData, LoginSchema } from 'src/types/auth'
import BlankLayout from 'src/views/layouts/BlankLayout'
import GoogleLogin from 'src/views/layouts/components/login/GoogleLogin'
import FacebookLogin from 'src/views/layouts/components/login/FacebookLogin'
import OTP from 'src/views/layouts/components/login/OTP'
import TOTP from 'src/views/layouts/components/login/TOTP'
import ForgotPassword from 'src/views/layouts/components/login/ForgotPassword'

type TProps = {}

interface Datainit {
  email: string
  tempToken: string
  isRemmember: boolean
}

const PageLogin: NextPage<TProps> = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [openFPassword, setOpenFPassword] = React.useState(false)
  const [isRemmember, setIsRemmember] = React.useState(false)
  const [dataInit, setDataInit] = React.useState<Datainit>()
  const [showOTP, setShowOTP] = React.useState(false)
  const [showTOTP, setShowTOTP] = React.useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(LoginSchema),
    shouldUnregister: true
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const res = await loginAuth(data)

      if (res && res.data) {
        if (res.data.needOTP) {
          setDataInit({
            email: data.email,
            tempToken: res.data.tempToken,
            isRemmember: isRemmember
          })
          setShowOTP(res.data.needOTP)
        } else if (res.data.needTOTP) {
          setDataInit({
            email: data.email,
            tempToken: res.data.tempToken,
            isRemmember: isRemmember
          })
          setShowTOTP(res.data.needTOTP)
        }
      }
    } catch (error: any) {
      console.log('Error Login: ', error)
      toast.error(error?.response?.data?.message?.[0]?.error || 'Đã xảy ra lỗi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleClickShowFPassword = () => setOpenFPassword(!openFPassword)

  return (
    <Box>
      <Head>
        <title>Đăng nhập - Thổ Mộc</title>
        <meta name='description' content='Đăng nhập tài khoản ' />
      </Head>
      <CssBaseline enableColorScheme />
      <SignInContainer direction='column' justifyContent='space-between'>
        <CarCustomCard variant='outlined' elevation={0}>
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2
            }}
          >
            <Box>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <TextField
                      id='email'
                      type='email'
                      name='email'
                      placeholder='your@email.com'
                      autoComplete='email'
                      required
                      fullWidth
                      variant='outlined'
                      onChange={item => onChange(item)}
                      value={value}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                      FormHelperTextProps={{
                        className: 'helper-text'
                      }}
                      disabled={isLoading}
                    />
                  </>
                )}
                name='email'
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <TextField
                      name='password'
                      placeholder='••••••'
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      autoComplete='current-password'
                      required
                      fullWidth
                      variant='outlined'
                      onChange={item => onChange(item)}
                      value={value}
                      error={Boolean(errors?.password)}
                      helperText={errors?.password?.message}
                      FormHelperTextProps={{
                        className: 'helper-text'
                      }}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showPassword ? 'hide the password' : 'display the password'}
                              onClick={handleClickShowPassword}
                              edge='end'
                              disabled={isLoading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </>
                )}
                name='password'
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox value={isRemmember} onChange={e => setIsRemmember(e.target.checked)} color='primary' />
              }
              label='Remember me'
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={isLoading}
              sx={{
                position: 'relative',
                minHeight: '48px'
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white'
                    }}
                  />
                  <Typography sx={{ ml: 1, opacity: 0.8 }}>Signing in...</Typography>
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <Link
              component='button'
              type='button'
              onClick={handleClickShowFPassword}
              variant='body2'
              sx={{ alignSelf: 'center' }}
              disabled={isLoading}
            >
              Forgot your password?
            </Link>
          </Box>

          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <GoogleLogin />
            <FacebookLogin />
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href='/register' variant='body2' sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CarCustomCard>
      </SignInContainer>

      {showOTP && dataInit && <OTP open={showOTP} data={dataInit} handClose={() => setShowOTP(false)} />}
      {showTOTP && dataInit && <TOTP open={showTOTP} data={dataInit} handClose={() => setShowTOTP(false)} />}
      <ForgotPassword open={openFPassword} handleClose={handleClickShowFPassword} />
    </Box>
  )
}

PageLogin.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default PageLogin
