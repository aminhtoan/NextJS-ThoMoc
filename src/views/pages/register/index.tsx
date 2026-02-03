import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FacebookIcon, GoogleIcon } from 'src/components/Icon/SitemarkIcon'
import { registerAuth, sentOTP, verifyOTP } from 'src/service/auth'
import { RegisterBodySchema, RegisterBodyType, VerifyOTPType } from 'src/types/auth'
import CarCustomCard from '../../../components/sign-in/CustomCard'
import SignInContainer from '../../../components/sign-in/SignInContainer'

type TProps = {}

const helperTextStyle = {
  color: 'error.main',
  fontSize: '0.8rem',
  fontWeight: 500,
  mt: 0.5,
  fontFamily: 'Poppins'
}

const PageRegister: NextPage<TProps> = () => {
  const theme = useTheme()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showCPassword, setShowCPassword] = React.useState(false)
  const [dataInit, setDataInit] = React.useState<RegisterBodyType>()
  const [step, setStep] = React.useState(1) // 1: Gửi OTP, 2: Xác thực OTP, 3: Hoàn tất đăng ký
  const [loading, setLoading] = React.useState(false)
  const [, setOtpSent] = React.useState(false)
  const [otp, setOtp] = React.useState('')
  const route = useRouter()

  const defaultValues: RegisterBodyType = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    code: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<RegisterBodyType>({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(RegisterBodySchema)
  })

  const onSubmit = (data: any) => {
    setDataInit(data)

    if (step === 1) {
      handleSendOTP(data)
    } else if (step === 2) {
      handleVerifyOTP(data)
    } else if (step === 3) {
      handleRegister(data)
    }
  }

  // Gửi OTP
  const handleSendOTP = async (data: RegisterBodyType) => {
    setLoading(true)
    setOtp('')

    try {
      await sentOTP(data.email, 'REGISTER')
      toast.success('OTP đã được gửi tới email của bạn')
      setOtpSent(true)
      setStep(2)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message[0].message || 'Gửi OTP thất bại'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Xác thực OTP
  const handleVerifyOTP = async (data: VerifyOTPType) => {
    setLoading(true)
    try {
      setOtp(data.code || '')
      await verifyOTP(data)
      toast.success('OTP hợp lệ, tiếp tục đăng ký')
      setValue('code', '')

      setStep(3)
    } catch (err: any) {
      console.log(err)
      const errorMsg = err.response?.data?.message[0].message || 'OTP không hợp lệ'
      toast.error(errorMsg)
    }
    setLoading(false)
  }

  // Đăng ký
  const handleRegister = async (data: RegisterBodyType) => {
    setLoading(true)
    try {
      await registerAuth({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        name: data.name,
        phoneNumber: data.phoneNumber,
        code: otp
      })
      toast.success('Đăng ký thành công! Chuyển hướng...')
      setOtp('')
      setDataInit(undefined)
      reset()
      route.push('/login')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message[0].message || 'Đăng ký thất bại'
      toast.error(errorMsg)
    }
    setLoading(false)
  }

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleClickShowCPassword = () => setShowCPassword(show => !show)

  return (
    <Box >
      <Head>
        <title>Đăng Ký - Thổ Mộc</title>
        <meta name='description' content='Đăng ký tài khoản mới' />
      </Head>

      <CssBaseline enableColorScheme />
      <SignInContainer
        direction='column'
        justifyContent='flex-start'
        sx={{
          height: 'auto'
        }}
      >
        <CarCustomCard variant='outlined' elevation={0}>
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Sign Up
          </Typography>
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            {step === 2 && 'OTP Authentication'}
            {step === 3 && 'Complete Registration'}
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
            {step === 1 && (
              <>
                <Box>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormLabel htmlFor='name'>Name</FormLabel>
                        <TextField
                          id='name'
                          name='name'
                          placeholder='Nguyễn Văn A'
                          autoComplete='name'
                          required
                          fullWidth
                          variant='outlined'
                          onChange={item => onChange(item)}
                          value={value}
                          error={Boolean(errors?.name)}
                          onBlur={onBlur}
                          helperText={errors?.name?.message}
                          FormHelperTextProps={{
                            sx: helperTextStyle
                          }}
                          disabled={loading} // Disable input when loading
                        />
                      </>
                    )}
                    name='name'
                  />
                </Box>

                <Box>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
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
                          onBlur={onBlur}
                          FormHelperTextProps={{
                            sx: helperTextStyle
                          }}
                          disabled={loading} // Disable input when loading
                        />
                      </>
                    )}
                    name='email'
                  />
                </Box>

                <Box>
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
                          required
                          fullWidth
                          variant='outlined'
                          onChange={item => onChange(item)}
                          value={value}
                          error={Boolean(errors?.password)}
                          helperText={errors?.password?.message}
                          onBlur={onBlur}
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
                                  disabled={loading} // Disable button when loading
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          disabled={loading} // Disable input when loading
                        />
                      </>
                    )}
                    name='password'
                  />
                </Box>

                <Box>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
                        <TextField
                          name='confirmPassword'
                          placeholder='••••••'
                          type={showCPassword ? 'text' : 'password'}
                          id='confirmPassword'
                          autoComplete='current-password'
                          required
                          fullWidth
                          variant='outlined'
                          onChange={item => onChange(item)}
                          value={value}
                          error={Boolean(errors?.confirmPassword)}
                          onBlur={onBlur}
                          helperText={errors?.confirmPassword?.message}
                          FormHelperTextProps={{
                            sx: helperTextStyle
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label={showCPassword ? 'hide the password' : 'display the password'}
                                  onClick={handleClickShowCPassword}
                                  edge='end'
                                  disabled={loading} // Disable button when loading
                                >
                                  {showCPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          disabled={loading} // Disable input when loading
                        />
                      </>
                    )}
                    name='confirmPassword'
                  />
                </Box>

                <Box>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormLabel htmlFor='phone'>Phone</FormLabel>
                        <TextField
                          id='phone'
                          name='phone'
                          placeholder='0123456789'
                          autoComplete='phone'
                          required
                          fullWidth
                          variant='outlined'
                          onChange={item => onChange(item)}
                          value={value}
                          error={Boolean(errors?.phoneNumber)}
                          helperText={errors?.phoneNumber?.message}
                          onBlur={onBlur}
                          FormHelperTextProps={{
                            sx: helperTextStyle
                          }}
                          disabled={loading} // Disable button when loading
                        />
                      </>
                    )}
                    name='phoneNumber'
                  />
                </Box>

                <Button type='submit' fullWidth variant='contained' disabled={loading}>
                  Đăng ký
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Typography variant='body2' sx={{ textAlign: 'center', color: 'textSecondary' }}>
                  Vui lòng nhập mã OTP được gửi tới email: <strong>{dataInit?.email}</strong>
                </Typography>

                <Box>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormLabel htmlFor='code'>Mã OTP</FormLabel>
                        <TextField
                          id='code'
                          name='code'
                          placeholder='000000'
                          required
                          fullWidth
                          variant='outlined'
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                            onChange(val)
                          }}
                          value={value}
                          error={Boolean(errors?.code)}
                          helperText={errors?.code?.message}
                          onBlur={onBlur}
                          FormHelperTextProps={{
                            sx: helperTextStyle
                          }}
                          inputProps={{
                            maxLength: 6,
                            style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
                          }}
                          type='text'
                          inputMode='numeric'
                          disabled={loading} // Disable input when loading
                        />
                      </>
                    )}
                    name='code'
                  />
                </Box>

                <Button type='submit' fullWidth variant='contained' disabled={loading}>
                  Xác thực OTP
                </Button>

                <Button
                  type='button'
                  fullWidth
                  variant='text'
                  disabled={loading}
                  onClick={() => {
                    setStep(1)
                    setOtpSent(false)
                    setOtp('') // reset state
                    setValue('code', '') // reset form field
                  }}
                >
                  Quay lại
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Typography variant='h6' sx={{ textAlign: 'center', color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
                  Hoàn tất thông tin đăng ký của bạn
                </Typography>

                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    Email: <strong>{dataInit?.email}</strong>
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    Tên: <strong>{dataInit?.name}</strong>
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                    Số điện thoại: <strong>{dataInit?.phoneNumber}</strong>
                  </Typography>
                </Box>

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                >
                  {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
                </Button>

                <Button
                  type='button'
                  fullWidth
                  variant='outlined'
                  disabled={loading}
                  onClick={() => {
                    setStep(1)
                    setOtpSent(false)
                  }}
                  sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                >
                  Quay lại
                </Button>
              </>
            )}
          </Box>

          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href='/login' variant='body2' sx={{ alignSelf: 'center' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </CarCustomCard>
      </SignInContainer>
    </Box>
  )
}

export default PageRegister
