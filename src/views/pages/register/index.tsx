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
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import { FacebookIcon, GoogleIcon } from 'src/components/CustomIcons/SitemarkIcon'
import CarCustomCard from '../../../components/card/index'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import React from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import SignInContainer from '../../../components/containers/SignInContainer'
import OTP from 'src/components/auth/OTP'
import Head from 'next/head'
type TProps = {}

const helperTextStyle = {
  color: 'error.main',
  fontSize: '0.8rem',
  fontWeight: 500,
  mt: 0.5,
  fontFamily: 'Poppins'
}

type TDefaultValue = {
  email: string
  password: string
  confirmPassword: string
  name: string
  phoneNumber: string
  // code: string
}

const PageRegister: NextPage<TProps> = () => {
  const theme = useTheme()

  const schema = yup
    .object({
      email: yup.string().required('Vui lòng nhập email').matches(EMAIL_REG, `Địa chỉ email không hợp lệ`),
      password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .matches(PASSWORD_REG, `Password phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`)
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      name: yup.string().required('Vui lòng nhập tên'),
      confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
      phoneNumber: yup
        .string()
        .required('Vui lòng nhập số điện thoại ')
        .min(10, 'Số diện thoại phải có ít nhất 10 ký tự')
      // code: yup.string().required()
    })
    .required()

  const [showPassword, setShowPassword] = React.useState(false)
  const [showCPassword, setShowCPassword] = React.useState(false)
  const [dataInit, setDataInit] = React.useState<TDefaultValue>()
  const [showOTP, setShowOTP] = React.useState(false)
  const defaultValues: TDefaultValue = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: ''
    // code: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TDefaultValue>({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    setDataInit(data)
    console.log(dataInit)
  }

  const handleClickShowPassword = () => setShowPassword(show => !show)
  const handleClickShowCPassword = () => setShowCPassword(show => !show)

  const handleClickShowOTP = () => {
    if (dataInit) {
      setShowOTP(show => !show)
    }
  }

  return (
    <Box>
      <Head>
        <title>Đăng Ký - Thổ Mộc</title>
        <meta name='description' content='Đăng ký tài khoản mới' />
      </Head>

      <CssBaseline enableColorScheme />
      <SignInContainer
        direction='column'
        justifyContent='flex-start'
        sx={{
          height: 'auto',
          background: theme.palette.customColors.morningSky
        }}
      >
        <CarCustomCard variant='outlined' elevation={0}>
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Sign up
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormLabel htmlFor='name'>Name</FormLabel>
                    <TextField
                      id='name'
                      name='name'
                      placeholder='Nguyễn Văn A'
                      autoComplete='name'
                      autoFocus
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
                      autoFocus
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
                      autoFocus
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
                      autoFocus
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
                            >
                              {showCPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
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
                      placeholder='Nguyễn Văn A'
                      autoComplete='phone'
                      autoFocus
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
                    />
                  </>
                )}
                name='phoneNumber'
              />
            </Box>

            <Button type='submit' fullWidth variant='contained' onClick={handleClickShowOTP}>
              Sign up
            </Button>
          </Box>

          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href='/login' variant='body2' sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CarCustomCard>
      </SignInContainer>
      <OTP open={showOTP} handleClose={handleClickShowOTP} data={dataInit} />
    </Box>
  )
}

export default PageRegister
