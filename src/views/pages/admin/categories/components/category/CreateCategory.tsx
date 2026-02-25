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

// ** Service Import
import { CreateCategory } from 'src/service/category'
import { uploadMedia } from 'src/service/media'

// ** Types Import
import { CreateCategoryBodySchema, CreateCategoryBodyType } from 'src/types/category'

interface CreateCategoryProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const CreateCategories = ({ open, onClose, onCreated }: CreateCategoryProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<CreateCategoryBodyType>({
    defaultValues: {
      name: '',
      logo: '',
      parentCategoryId: undefined
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateCategoryBodySchema),
    shouldUnregister: true
  })

  const handleClose = () => {
    reset()
    setUploadedFile(null)
    onClose()
  }

  const onSubmit = async (data: CreateCategoryBodyType) => {
    try {
      setIsLoading(true)
      const uploadedMedia = await uploadMedia(uploadedFile, 'categories')
      data.logo = uploadedMedia.data.url
      await CreateCategory(data)
      toast.success(t('Create category successfully'))

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
      console.error('Error creating category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomModal open={open} onClose={handleClose} title={t('Create Category')} maxWidth={450}>
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

export default CreateCategories
