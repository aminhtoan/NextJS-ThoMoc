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
import { UpdateCategory } from 'src/service/category'
import { uploadMedia } from 'src/service/media'

// ** Types Import
import { UpdateCategoryBodySchema, UpdateCategoryBodyType, UpdateCategoryFormValues } from 'src/types/category'

interface Category {
  id: number
  name: string
  logo: string
  parentCategoryId?: number
}

interface UpdateCategoryProps {
  open: boolean
  onClose: () => void
  onUpdated?: () => void
  category: Category | null // Replace with proper Category type
}

const UpdateCategoryComponent = ({ open, onClose, category, onUpdated }: UpdateCategoryProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)
  console.log('Category data in UpdateCategoryComponent:', previewImage)
  const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateCategoryFormValues>({
    defaultValues: {
      name: '',
      logo: '',
      parentCategoryId: undefined
    },
    mode: 'onBlur',
    resolver: yupResolver(UpdateCategoryBodySchema),
    shouldUnregister: true
  })

  React.useEffect(() => {
    if (open && category) {
      setValue('name', category.name)
      setValue('logo', category.logo)
      if (category.parentCategoryId) {
        setValue('parentCategoryId', category.parentCategoryId)
      }
    } else {
      reset()
      setUploadedFile(null)
    }
  }, [open, category, setValue, reset])

  const handleClose = () => {
    reset()
    setUploadedFile(null)
    setPreviewImage(null)
    onClose()
  }

  const onSubmit = async (data: UpdateCategoryBodyType) => {
    // Check if no changes
    if (
      category &&
      data.name === category.name &&
      data.logo === category.logo &&
      !uploadedFile &&
      (data.parentCategoryId === category.parentCategoryId || (!data.parentCategoryId && !category.parentCategoryId))
    ) {
      toast('No changes detected', {
        icon: '⚠️'
      })

      return
    }

    try {
      setIsLoading(true)

      // If user uploaded new file, upload it first
      if (uploadedFile) {
        const uploadedMedia = await uploadMedia(uploadedFile, 'categories')
        data.logo = uploadedMedia.data.url
      }

      await UpdateCategory(category?.id as number, data)
      toast.success(t('Update category successfully'))

      if (typeof onUpdated === 'function') {
        onUpdated()
      }

      handleClose()
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message?.[0]?.error ||
        error?.response?.data?.message?.[0]?.message ||
        error?.response?.data?.message ||
        t('An error occurred')

      toast.error(errorMessage)
      console.error('Error updating category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)

    // Generate preview URL từ file
    const reader = new FileReader()
    console.log('File uploaded:', file)
    console.log('File type:', reader.result)
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <CustomModal open={open} onClose={handleClose} title={t('Update Category')} maxWidth={450}>
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
            render={({ field: { value } }) => (
              <>
                <FormLabel>{t('Logo')}</FormLabel>
                <WrapperFileUpload
                  uploadFunc={handleFileUpload}
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
                      flexDirection: 'column',
                      gap: 1,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    {uploadedFile && previewImage ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src={previewImage || value || '/images/default-product.png'}
                          alt='New logo preview'
                          style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '8px' }}
                        />
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{uploadedFile.name}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#666' }}>
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </Box>
                    ) : value ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src={value}
                          alt='Current logo'
                          style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '8px' }}
                        />
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>{t('Click to change logo')}</p>
                      </Box>
                    ) : (
                      <p style={{ margin: 0 }}>{t('Drag and drop or click to upload image')}</p>
                    )}
                  </Box>
                </WrapperFileUpload>
                {errors?.logo && typeof errors.logo.message === 'string' && (
                  <span
                    className='helper-text'
                    style={{
                      color: '#d32f2f',
                      fontSize: '0.75rem',
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    {errors.logo.message}
                  </span>
                )}
              </>
            )}
          />
        </Box>

        {errors?.logo && typeof errors.logo.message === 'string' && (
          <span
            className='helper-text'
            style={{
              color: '#d32f2f',
              fontSize: '0.75rem',
              marginTop: '4px',
              display: 'block'
            }}
          >
            {errors.logo.message}
          </span>
        )}

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
                  placeholder={t('Category name')}
                  autoComplete='off'
                  required
                  fullWidth
                  variant='outlined'
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors?.name)}
                  helperText={
                    errors?.name?.message && typeof errors.name.message === 'string' ? errors.name.message : ''
                  }
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
            {isLoading ? t('Updating...') : t('Update')}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  )
}

export default UpdateCategoryComponent
