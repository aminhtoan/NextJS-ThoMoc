// ** Yup
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import { Box, Button, TextField } from '@mui/material'

// ** React Imports
import React from 'react'

// ** Hook Form Imports
import { Controller, useForm } from 'react-hook-form'

// ** Toast Import
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Custom Modal Import
import CustomModal from 'src/components/CustomModal/CustomModal'

// ** Service Import
import { createRole } from 'src/service/role'

// ** Types Import
import { CreateRoleBodySchema, CreateRoleBodyType } from 'src/types/role'

interface CreateRoleProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const CreateRole = ({ open, onClose, onCreated }: CreateRoleProps) => {
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
      description: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateRoleBodySchema),
    shouldUnregister: true
  })

  const onSubmit = async (data: CreateRoleBodyType) => {
    try {
      setIsLoading(true)
      await createRole(data)
      toast.success(t('Create role successfully'))
      if (typeof onCreated === 'function') onCreated()
      onClose()
      reset()
    } catch (error: any) {
      console.error('Create role error:', error.response?.data)
      toast.error(
        error?.response?.data?.message?.[0]?.error ||
          error?.response?.data?.message?.[0]?.message ||
          t('An error occurred')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CustomModal open={open} onClose={onClose} title={t('Create Role')} maxWidth={450}>
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
                <TextField
                  label={t('Name')}
                  id='name'
                  type='text'
                  name='name'
                  placeholder={t('Role name')}
                  autoComplete={t('name')}
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
                <TextField
                  label={t('Description')}
                  name='description'
                  placeholder={t('Role description')}
                  type='text'
                  id='description'
                  autoComplete={t('description')}
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

export default CreateRole
