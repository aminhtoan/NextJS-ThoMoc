import { yupResolver } from '@hookform/resolvers/yup'
import { Checkbox, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import handleAPI from 'src/apis/handleAPI'
import OtpInput from 'src/components/otp-input'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'
import { sentOTP, verifyEmailAuth, verifyOTP } from 'src/service/auth'
import { EmailSchema, EmailType, OtpSchema, OtpType } from 'src/types/auth'

const EmailPage = () => {
  const { t } = useTranslation()
  const { setUser, user } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [newEmail, setNewEmail] = React.useState('')
  const router = useRouter()
  const { handleSubmit, control, setError } = useForm<EmailType>({
    mode: 'onBlur',
    resolver: yupResolver(EmailSchema),
    defaultValues: {
      email: ''
    }
  })

  const {
    handleSubmit: handleSubmitOtp,
    control: controlOtp,
    reset: resetOtp
  } = useForm<OtpType>({
    mode: 'onBlur',
    resolver: yupResolver(OtpSchema),
    defaultValues: {
      code: ''
    }
  })

  const handleEmail = async (data: { email: string }) => {
    setIsLoading(true)
    try {
      await verifyEmailAuth(data.email)
      await sentOTP(data.email, 'CHANGE_EMAIL')
      setNewEmail(data.email)
      setStep(2)
      toast.success(t('OTP sent to your email'))
    } catch (error: any) {
      setError('email', {
        type: 'manual',
        message:
          error.response?.data?.message?.[0]?.message || error.response?.data?.message || t('Invalid or existing email')
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (data: OtpType) => {
    // Gọi API của bạn ở đây
    try {
      const response = await verifyOTP({
        email: newEmail,
        code: data.code,
        type: 'CHANGE_EMAIL'
      })
      setUser({ ...user, email: newEmail } as UserDataType)

      handleAPI('/auth/myProfile', { email: newEmail }, 'put')
      router.replace('/my-profile')
      toast.success(t('Email address has been successfully updated'))
    } catch (error: any) {
      toast.error(error.response?.data?.message?.[0]?.message || t('Invalid OTP, please try again'))
    }
  }

  const onSubmit = (data: EmailType) => {
    handleEmail(data)
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
          {t('Change email address')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      {step === 1 && (
        <>
          {/* Label */}
          <Grid item xs={4}>
            <Typography>{t('New email address')}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Grid container spacing={1} gap={3} component='form' onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                      <input
                        id='email'
                        type='email'
                        placeholder={t('Login to your email address')}
                        required
                        style={{
                          height: '40px',
                          width: '100%',
                          padding: '8px 12px',
                          border: error ? '1px solid red' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value || ''}
                        disabled={isLoading}
                      />
                      {/* Hiển thị lỗi */}
                      {error && (
                        <Typography
                          variant='caption'
                          color='error'
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            fontSize: '0.8rem',
                            fontFamily: 'Poppins'
                          }}
                        >
                          {error.message}
                        </Typography>
                      )}
                    </>
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
                  {isLoading ? t('Processing...') : t('Next')}
                </button>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{
                        color: '#1975D1 !important',
                        '&.Mui-checked': {
                          color: '#1975D1 !important'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant='caption' color='text.secondary' sx={{ fontFamily: 'Poppins' }}>
                      {t('I have read and accept all terms, policies, and regulations regarding information privacy.')}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}

      {step === 2 && (
        <>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
              {t('Please enter the OTP sent to your email:')} <strong>{newEmail}</strong>
            </Typography>
          </Grid>

          <Grid item xs={4}></Grid>

          <Grid item xs={6}>
            <Grid container spacing={3} component='form' onSubmit={handleSubmitOtp(handleOtpSubmit)}>
              <Grid item xs={12}>
                <Controller
                  name='code'
                  control={controlOtp}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <OtpInput
                      value={value || ''}
                      onChange={onChange}
                      error={error?.message}
                      disabled={isLoading}
                      label={t('OTP Verification')}
                      length={6}
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
                    width: '120px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  disabled={isLoading}
                  onMouseEnter={e => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#1565C0'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#1975D1'
                    }
                  }}
                >
                  {isLoading ? t('Processing...') : t('OTP Verification')}
                </button>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant='caption'
                  sx={{ color: 'primary.main', cursor: 'pointer', fontFamily: 'Poppins' }}
                  onClick={() => {
                    if (!isLoading) {
                      setStep(1)
                      resetOtp()
                    }
                  }}
                >
                  {t('Back to previous step')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default EmailPage
