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
import CustomModal from 'src/components/CustomModal/CustomModal'

// ** Service Import
import { getAllRoles } from 'src/service/role'
import { createUser } from 'src/service/user'

// ** Types Import
import { CreateUserBodySchema, CreateUserBodyType } from 'src/types/user'

interface CreateUserProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const CreateUser = ({ open, onClose, onCreated }: CreateUserProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [roles, setRoles] = React.useState<any[]>([])
  const { t } = useTranslation()

  React.useEffect(() => {
    fetchRoles()
  }, [open])

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles({ page: 1, limit: 100 })
      setRoles(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      roleId: undefined,
      status: undefined
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateUserBodySchema),
    shouldUnregister: true
  })

  const onSubmit = async (data: CreateUserBodyType) => {
    try {
      setIsLoading(true)
      await createUser(data)
      toast.success(t('Create user successfully'))
      if (typeof onCreated === 'function') onCreated()
      onClose()
      reset()
    } catch (error: any) {
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
    <CustomModal open={open} onClose={onClose} title={t('Create User')} maxWidth={450}>
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
                <FormLabel>Email</FormLabel>
                <TextField
                  name='email'
                  placeholder={t('Email')}
                  type='text'
                  id='email'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='email'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Phone')}</FormLabel>
                <TextField
                  name='phoneNumber'
                  placeholder={t('Phone')}
                  type='text'
                  id='phoneNumber'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.phoneNumber)}
                  helperText={errors?.phoneNumber?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='phoneNumber'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Password')}</FormLabel>
                <TextField
                  name='password'
                  placeholder={t('Password')}
                  type='password'
                  id='password'
                  autoComplete='off'
                  required={false}
                  fullWidth
                  variant='outlined'
                  onChange={item => onChange(item)}
                  value={value}
                  error={Boolean(errors?.password)}
                  helperText={errors?.password?.message}
                  FormHelperTextProps={{
                    className: 'helper-text'
                  }}
                  disabled={isLoading}
                />
              </>
            )}
            name='password'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Role')}</FormLabel>
                <Select
                  name='role'
                  id='role'
                  value={value || ''}
                  onChange={onChange}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors?.roleId)}
                  disabled={isLoading}
                  displayEmpty
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left'
                    },
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        '& .MuiMenuItem-root': {
                          fontSize: '15px',
                          minHeight: 32,
                          paddingY: 0.5
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value='' disabled>
                    {t('Select Role')}
                  </MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.roleId && (
                  <FormLabel sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.roleId.message}
                  </FormLabel>
                )}
              </>
            )}
            name='roleId'
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <FormLabel>{t('Status')}</FormLabel>
                <Select
                  name='status'
                  id='status'
                  value={value || ''}
                  onChange={onChange}
                  fullWidth
                  variant='outlined'
                  error={Boolean(errors?.status)}
                  disabled={isLoading}
                  displayEmpty
                >
                  <MenuItem value='' disabled>
                    {t('Select Status')}
                  </MenuItem>
                  <MenuItem value='ACTIVE'>{t('Active')}</MenuItem>
                  <MenuItem value='INACTIVE'>{t('Inactive')}</MenuItem>
                </Select>
                {errors?.status && (
                  <FormLabel sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.status.message}
                  </FormLabel>
                )}
              </>
            )}
            name='status'
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

export default CreateUser
