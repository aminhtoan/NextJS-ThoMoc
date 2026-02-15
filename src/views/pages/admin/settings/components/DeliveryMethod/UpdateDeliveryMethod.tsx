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
import { updateDeliveryMethod } from 'src/service/delivery-methods'
import { UpdateDeliveryMethodSchema, UpdateDeliveryMethodType } from 'src/types/delivery-methods'

// ** Service Import

interface CreateUserProps {
  open: boolean
  onClose: () => void
  onUpdated?: () => void
  data: UpdateDeliveryMethodType | null
  rowId: number | null
}

const UpdateDeliveryMethod = ({ open, onClose, data, onUpdated, rowId }: CreateUserProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateDeliveryMethodType>({
    mode: 'onBlur',
    resolver: yupResolver(UpdateDeliveryMethodSchema),
    shouldUnregister: true
  })

  React.useEffect(() => {
    if (open && data) {
      setValue('name', data.name)
      setValue('code', data.code)
      setValue('price', data.price)
      setValue('description', data.description)
      setValue('isActive', data.isActive)
    } else {
      reset()
    }
  }, [open, data, setValue, reset])

  const onSubmit = async (deliv: UpdateDeliveryMethodType) => {
    if (
      data &&
      data.name === deliv.name &&
      data.code === deliv.code &&
      String(data.isActive) === String(deliv.isActive) &&
      data.price === deliv.price &&
      data.description === deliv.description
    ) {
      toast.error(t('No changes detected'))

      return
    }

    try {
      setIsLoading(true)
      await updateDeliveryMethod(rowId!, deliv)
      toast.success(t('Update delivery method successfully'))
      if (typeof onUpdated === 'function') onUpdated()
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
    <CustomModal open={open} onClose={onClose} title={t('Update Delivery Method')} maxWidth={450}>
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
                <FormLabel>{t('Price')}</FormLabel>
                <TextField
                  name='price'
                  placeholder={t('Price')}
                  type='number'
                  id='price'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.price)}
                  helperText={errors?.price?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='price'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Description')}</FormLabel>
                <TextField
                  name='description'
                  placeholder={t('Description')}
                  type='text'
                  id='description'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.description)}
                  helperText={errors?.description?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='description'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Active')}</FormLabel>
                <Select
                  name='isActive'
                  id='isActive'
                  value={value}
                  onChange={onChange}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors?.isActive)}
                  disabled={isLoading}
                  displayEmpty
                >
                  <MenuItem value='' disabled>
                    {t('Select Status')}
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
            {t('Update')}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  )
}

export default UpdateDeliveryMethod
