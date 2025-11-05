import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Checkbox,
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
import { useRouter } from 'next/router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import handleAPI from 'src/apis/handleAPI'
import ForgotPassword from 'src/components/auth/ForgotPassword'
import GoogleLogin from 'src/components/auth/GoogleLogin'
import { FacebookIcon } from 'src/components/Icon/SitemarkIcon'
import SignInContainer from 'src/components/sign-in/SignInContainer'
import { LoginFormData, LoginSchema } from 'src/models/auth.model'
import CarCustomCard from '../../../components/sign-in/CustomCard'

type TProps = {}

const helperTextStyle = {
  color: 'error.main',
  fontSize: '0.8rem',
  fontWeight: 500,
  mt: 0.5,
  fontFamily: 'Poppins'
}

const PageLogin: NextPage<TProps> = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [openFPassword, setOpenFPassword] = React.useState(false)
  const [isRemmember, setIsRemmember] = React.useState(false)
  const router = useRouter()
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
    resolver: yupResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await handleAPI('/auth/login', data, 'post')

      if (isRemmember) {
        localStorage.setItem('accessToken', res.data.accessToken)
      }
      toast.success('Đăng nhập thành công')
      router.push('/')
    } catch (error: any) {
      console.log('Error Login: ', error)
      toast.error(error)
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
            autoComplete='off'
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
                      autoFocus
                      required
                      fullWidth
                      variant='outlined'
                      onChange={item => onChange(item)}
                      value={value}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                      FormHelperTextProps={{
                        sx: helperTextStyle
                      }}
                    />
                  </>
                )}
                name='email'
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <TextField
                      name='password'
                      placeholder='••••••'
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      autoComplete='current-password'
                      autoFocus
                      required
                      fullWidth
                      variant='outlined'
                      onChange={item => onChange(item)}
                      value={value}
                      error={Boolean(errors?.password)}
                      helperText={errors?.password?.message}
                      FormHelperTextProps={{
                        sx: helperTextStyle
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showPassword ? 'hide the password' : 'display the password'}
                              onClick={handleClickShowPassword}
                              edge='end'
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

            <Button type='submit' fullWidth variant='contained'>
              Sign in
            </Button>

            <Link
              component='button'
              type='button'
              onClick={handleClickShowFPassword}
              variant='body2'
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <GoogleLogin />
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href='/register' variant='body2' sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CarCustomCard>
      </SignInContainer>

      <ForgotPassword open={openFPassword} handleClose={handleClickShowFPassword} />
    </Box>
  )
}

export default PageLogin
