// ** Yup
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import { Box, Button, FormLabel, MenuItem, Select, TextField } from '@mui/material'

// ** React Imports
import React from 'react'

// ** Hook Form Imports
import { Controller, useForm } from 'react-hook-form'

// ** Toast Import
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Custom Modal Import
import CustomModal from 'src/components/CustomModal'
import { createPaymentMethod } from 'src/service/payment-methods'

// ** Service Import
import { CreatePaymentMethodSchema, CreatePaymentMethodType } from 'src/types/payment-methods'

interface CreateUserProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const CreatePaymentMethod = ({ open, onClose, onCreated }: CreateUserProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      isActive: false
    },
    mode: 'onBlur',
    resolver: yupResolver(CreatePaymentMethodSchema),
    shouldUnregister: true
  })

  const onSubmit = async (data: CreatePaymentMethodType) => {
    try {
      setIsLoading(true)
      await createPaymentMethod(data)
      toast.success(t('Create payment method successfully'))
      if (typeof onCreated === 'function') onCreated()
      onClose()
      reset()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.response?.data?.message?.[0]?.message || t('An error occurred')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomModal open={open} onClose={onClose} title={t('Create Payment Method')} maxWidth={450}>
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
                <FormLabel>{t('Name')}</FormLabel>
                <TextField
                  id='name'
                  type='text'
                  name='name'
                  placeholder={t('User name')}
                  autoComplete='off'
                  required
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
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
            name='name'
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Code')}</FormLabel>
                <TextField
                  name='code'
                  placeholder={t('Code')}
                  type='text'
                  id='code'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.code)}
                  helperText={errors?.code?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='code'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Is Active')}</FormLabel>
                <Select
                  name='status'
                  id='status'
                  value={value || ''}
                  onChange={onChange}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors?.isActive)}
                  disabled={isLoading}
                  displayEmpty
                >
                  <MenuItem value='' disabled>
                    {t('Select Is Active')}
                  </MenuItem>
                  <MenuItem value='true'>{t('Active')}</MenuItem>
                  <MenuItem value='false'>{t('Inactive')}</MenuItem>
                </Select>
                {errors?.isActive && (
                  <FormLabel sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.isActive.message}
                  </FormLabel>
                )}
              </>
            )}
            name='isActive'
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant='outlined' onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Button type='submit' variant='contained' disabled={isLoading}>
            {t('Create')}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  )
}

export default CreatePaymentMethod
