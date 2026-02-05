import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Button, Divider, Grid, Paper, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { UpdateMyProfileBodySchema, UpdateMyProfileBodyType } from 'src/types/auth'

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

const ProfileFormSample = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [initialValues, setInitialValues] = useState<UpdateMyProfileBodyType>({
    avatar: null,
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  })

  const { t } = useTranslation()

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
    reset,
    watch
  } = useForm<UpdateMyProfileBodyType>({
    defaultValues,
    resolver: yupResolver(UpdateMyProfileBodySchema)
  })

  // Theo dõi các trường để biết khi nào có thay đổi
  const currentValues = watch()
  console.log('Current form values:', currentValues)

  useEffect(() => {
    if (!user) return

    const initialData: UpdateMyProfileBodyType = {
      email: user.email || '',
      password: 'Matkhau@111', // Placeholder cho mật khẩu
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
      avatar: null
    }

    reset(initialData)
    setInitialValues(initialData)
    setPreviewAvatar(user.avatar || null)
  }, [user, reset])

  const handleSubmitForm = (data: UpdateMyProfileBodyType) => {
    // Tạo object chỉ chứa dữ liệu thay đổi
    const changedData: Partial<UpdateMyProfileBodyType> & { avatarFile?: File } = {}

    // So sánh từng trường
    Object.keys(data).forEach(key => {
      const fieldKey = key as keyof UpdateMyProfileBodyType
      const currentValue = data[fieldKey]
      const initialValue = initialValues[fieldKey]

      // Bỏ qua trường nếu không thay đổi
      if (currentValue !== initialValue) {
        // Xử lý đặc biệt cho password (nếu vẫn là placeholder)
        if (fieldKey === 'password' && currentValue === '**********') {
          return // Bỏ qua, không thêm vào changedData
        }

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
      console.log('Không có thông tin nào thay đổi')

      // Có thể hiển thị thông báo cho người dùng
      alert(t('No changes detected'))

      return
    }

    console.log('Chỉ gửi dữ liệu thay đổi:', changedData)

    // Gọi API với changedData
    // updateProfile(changedData)

    // Sau khi submit thành công, cập nhật initialValues
    // để lần submit tiếp theo chỉ gửi những thay đổi mới
    const newInitialValues = {
      ...initialValues,
      ...changedData,
      password: '**********' // Reset password placeholder
    }
    setInitialValues(newInitialValues)

    // Nếu có avatar mới, cập nhật preview
    if (avatarFile) {
      setAvatarFile(null)
    }
  }

  const handleUploadAvatar = (file: File, onChange: (file: File) => void) => {
    onChange(file)
    setAvatarFile(file)
    setPreviewAvatar(URL.createObjectURL(file))
  }

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
              </FormRow>

              {/* BUTTON */}
              <Grid item xs={12}>
                <Grid container>
                  <Grid item sx={{ width: 140 }} />
                  <Grid item>
                    <Button
                      type='submit'
                      variant='contained'
                      disabled={!isDirty && !avatarFile} // Disable nếu không có thay đổi
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
                    <Button variant='outlined' size='small' component='span'>
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
    </Paper>
  )
}

export default ProfileFormSample
