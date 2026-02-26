// ** Yup
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import { Box, Button, FormLabel, TextField } from '@mui/material'

// ** React Imports
import React from 'react'

// ** Hook Form Imports
import { Controller, useForm } from 'react-hook-form'

// ** Toast Import
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Custom Modal Import
import CustomModal from 'src/components/CustomModal'
import WrapperFileUpload from 'src/components/WrapperFileUpload'
import { CreateBrand } from 'src/service/brand'

// ** Service Import
import { uploadMedia } from 'src/service/media'
import { CreateBrandBodySchema, CreateBrandBodyType } from 'src/types/brand'

// ** Types Import

interface CreateCategoryProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const CreateBrands = ({ open, onClose, onCreated }: CreateCategoryProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateBrandBodyType>({
    defaultValues: {
      name: '',
      logo: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateBrandBodySchema),
    shouldUnregister: true
  })

  const handleClose = () => {
    reset()
    setUploadedFile(null)
    setValue('logo', '')
    onClose()
  }

  const onSubmit = async (data: CreateBrandBodyType) => {
    try {
      setIsLoading(true)
      const uploadedMedia = await uploadMedia(uploadedFile, 'brands')
      data.logo = uploadedMedia.data.url
      await CreateBrand(data)
      toast.success(t('Create brand successfully'))

      if (typeof onCreated === 'function') {
        onCreated()
      }

      handleClose()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message?.[0]?.error ||
        error?.response?.data?.message?.[0]?.message ||
        error?.response?.data?.message ||
        t('An error occurred')

      toast.error(errorMessage)
      console.error('Error creating brand:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomModal open={open} onClose={handleClose} title={t('Create Brand')} maxWidth={450}>
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
        {/* Logo Upload Field */}
        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            name='logo'
            render={({}) => (
              <>
                <FormLabel required>{t('Logo')}</FormLabel>
                <WrapperFileUpload
                  uploadFunc={file => {
                    setUploadedFile(file)
                    setValue('logo', file.name)
                  }}
                  objectAcceptFile={{
                    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
                  }}
                >
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      minHeight: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    {uploadedFile ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          {t('File')}: {uploadedFile.name}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#666' }}>
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </Box>
                    ) : (
                      <p style={{ margin: 0 }}>{t('Drag and drop or click to upload image')}</p>
                    )}
                  </Box>
                </WrapperFileUpload>
                {errors?.logo && (
                  <span
                    className='helper-text'
                    style={{
                      color: '#d32f2f',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {errors?.logo?.message}
                  </span>
                )}
              </>
            )}
          />
        </Box>

        {/* Name Field */}
        <Box>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel required>{t('Name')}</FormLabel>
                <TextField
                  id='name'
                  type='text'
                  name='name'
                  placeholder={t('Enter category name')}
                  autoComplete='off'
                  required
                  fullWidth
                  variant='outlined'
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors?.name)}
                  helperText={errors?.name?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant='outlined' onClick={handleClose} disabled={isLoading}>
            {t('Cancel')}
          </Button>

          <Button type='submit' variant='contained' disabled={isLoading}>
            {isLoading ? t('Creating...') : t('Create')}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  )
}

export default CreateBrands
