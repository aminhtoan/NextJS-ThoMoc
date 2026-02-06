import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Button, CircularProgress, Divider, Grid, TextField, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import api from 'src/apis/axiosClient'
import handleAPI from 'src/apis/handleAPI'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'
import { UpdateMyProfileBodySchema, UpdateMyProfileBodyType } from 'src/types/auth'

type TProps = {}

/* ===== Row ===== */
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

const PageMyProfile: NextPage<TProps> = () => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const { t } = useTranslation()
  const theme = useTheme()
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [initialValues, setInitialValues] = useState<UpdateMyProfileBodyType>({
    avatar: null,
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  })

  const defaultValues: UpdateMyProfileBodyType = {
    avatar: null,
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  }

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset
  } = useForm<UpdateMyProfileBodyType>({
    defaultValues,
    resolver: yupResolver(UpdateMyProfileBodySchema)
  })

  useEffect(() => {
    if (!user) return

    const initialData: UpdateMyProfileBodyType = {
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar
    }

    reset(initialData)
    setInitialValues(initialData)
    setPreviewAvatar(user.avatar || null)
  }, [user, reset])

  const handleSubmitForm = async (data: UpdateMyProfileBodyType) => {
    setIsLoading(true)

    // Tạo object chỉ chứa dữ liệu thay đổi
    const changedData: Partial<UpdateMyProfileBodyType> & { avatarFile?: File } = {}

    // So sánh từng trường
    Object.keys(data).forEach(key => {
      const fieldKey = key as keyof UpdateMyProfileBodyType
      const currentValue = data[fieldKey]
      const initialValue = initialValues[fieldKey]

      // Bỏ qua trường nếu không thay đổi
      if (currentValue !== initialValue) {
        // Xử lý đặc biệt cho avatar
        if (fieldKey === 'avatar') {
          if (avatarFile) {
            // Thêm file avatar riêng nếu có
            changedData.avatarFile = avatarFile
          }

          // Vẫn thêm trường avatar vào changedData nếu cần
          changedData[fieldKey] = currentValue
        } else {
          changedData[fieldKey] = currentValue
        }
      }
    })

    // Kiểm tra nếu không có gì thay đổi
    if (Object.keys(changedData).length === 0) {
      // Có thể hiển thị thông báo cho người dùng
      toast(t('No changes detected'), { icon: '⚠️' })
      setIsLoading(false)

      return
    }

    try {
      // Gọi API với changedData
      if (changedData.avatarFile) {
        const formData = new FormData()
        formData.append('file', changedData.avatarFile) // key phải là 'file'
        formData.append('folder', 'avatars')

        const url = await api.post('/media/image/cloudinary', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        changedData.avatar = url.data.url

        if (user && url.data.url) {
          setUser({ ...user, avatar: url.data.url })
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatarFile, ...profileData } = changedData

        await handleAPI('/auth/myProfile', profileData, 'put')

        toast.success(t('Updated successfully'))

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatarFile: _, ...cleanChangedData } = changedData

        const newInitialValues = {
          ...initialValues,
          ...cleanChangedData
        }

        setInitialValues(newInitialValues)

        reset({ ...data, avatar: changedData.avatar })
        setIsLoading(false)

        return
      }

      await handleAPI('/auth/myProfile', changedData, 'put')
      if (user) {
        setUser({
          ...user,
          ...changedData
        } as UserDataType)
      }

      // Sau khi submit thành công, cập nhật initialValues
      // để lần submit tiếp theo chỉ gửi những thay đổi mới
      const newInitialValues = {
        ...initialValues,
        ...changedData
      }
      setInitialValues(newInitialValues)
      reset(data)

      toast.success(t('Updated successfully'))
    } catch (error: any) {
      toast.error(
        error.response?.data?.message?.[0]?.message ||
          error.response?.data?.message ||
          error.message ||
          'Something went wrong'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadAvatar = (file: File, onChange: (file: File) => void) => {
    onChange(file)
    setAvatarFile(file)
    setPreviewAvatar(URL.createObjectURL(file))
  }

  const maskEmail = (email: string) => {
    if (!email) return ''
    const [name, domain] = email.split('@')
    if (name.length <= 2) return '*@' + domain

    return name.slice(0, 2) + '*'.repeat(name.length - 2) + '@' + domain
  }

  return (
    <>
      {/* ===== Header ===== */}
      <Typography variant='h5' mb={1} sx={{ color: 'black' }}>
        {t('My Profile')}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={3}>
        {t('ManageInfo')}
      </Typography>

      <Divider sx={{ mb: 10, mt: 5 }} />
      <form onSubmit={handleSubmit(handleSubmitForm)}>
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
                gap: 3,
                backgroundColor: theme.palette.background.paper
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
                      disabled={isLoading}
                    />
                  )}
                />
              </FormRow>

              {/* EMAIL */}
              <FormRow label={t('Email')}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item xs={8}>
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
                          value={maskEmail(field.value!)}
                          disabled={true}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                      sx={{ color: '#1975D1', whiteSpace: 'nowrap' }}
                      onClick={() => router.push('/my-profile/email')}
                    >
                      {t('Change')}
                    </Button>
                  </Grid>
                </Grid>
              </FormRow>

              {/* PHONE */}
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
                      disabled={isLoading}
                    />
                  )}
                />
              </FormRow>

              {/* PASSWORD */}
              {/* <FormRow label={t('Password')}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size='small'
                      type='password'
                      placeholder='••••••'
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      onChange={e => {
                        // Nếu người dùng bắt đầu nhập, xóa placeholder
                        if (e.target.value !== '**********') {
                          field.onChange(e.target.value)
                        }
                      }}
                    />
                  )}
                />
              </FormRow> */}

              {/* BUTTON */}
              <Grid item xs={12}>
                <Grid container>
                  <Grid item sx={{ width: 140 }} />
                  <Grid item>
                    <Button
                      type='submit'
                      variant='contained'
                      disabled={(!isDirty && !avatarFile) || isLoading} // Disable nếu không có thay đổi
                      sx={{
                        px: 4,
                        bgcolor: '#ee4d2d',
                        '&:hover': { bgcolor: '#d73211' },
                        '&.Mui-disabled': {
                          bgcolor: '#e0e0e0',
                          color: '#9e9e9e'
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress
                            size={24}
                            sx={{
                              color: '#fff',
                              position: 'absolute'
                            }}
                          />
                          <span style={{ opacity: 0 }}>{t('Save')}</span>
                        </>
                      ) : (
                        t('Save')
                      )}
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
            <Controller
              name='avatar'
              control={control}
              render={({ field }) => (
                <>
                  <Avatar src={previewAvatar || undefined} sx={{ width: 100, height: 100 }} />

                  <WrapperFileUpload
                    uploadFunc={file => handleUploadAvatar(file, field.onChange)}
                    objectAcceptFile={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                  >
                    <Button variant='outlined' size='small' component='span' disabled={isLoading}>
                      {t('ChangeImage')}
                    </Button>
                  </WrapperFileUpload>

                  {errors.avatar && (
                    <Typography color='error' variant='caption'>
                      {errors.avatar.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
        </Box>
      </form>
    </>
  )
}

export default PageMyProfile
