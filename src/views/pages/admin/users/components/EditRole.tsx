// ** MUI Imports
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// ** React Imports
import React, { useEffect, useRef, useState } from 'react'

// ** Toast Import
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Redux Imports
import { useDispatch } from 'react-redux'

// ** Custom Modal Import
import CustomModal from 'src/components/CustomModal/CustomModal'

// ** Service Imports
import { getRoleById, updateRole } from 'src/service/role'
import { getPermission } from 'src/service/permission'

// ** Store Imports
import { AppDispatch } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'

// ** Types
import { Permission } from 'src/types/role'

interface EditRoleProps {
  open: boolean
  onClose: () => void
  idRole: number
  page: number
  pageSize: number
}

// Nhóm permissions theo module
const groupPermissionsByModule = (permissions: Permission[]) => {
  return permissions.reduce(
    (acc, perm) => {
      const moduleName = perm.module || 'Other'
      if (!acc[moduleName]) acc[moduleName] = []
      acc[moduleName].push(perm)

      return acc
    },

    {} as Record<string, Permission[]>
  )
}

// Map HTTP method sang màu
const getMethodColor = (method: string): 'success' | 'primary' | 'warning' | 'error' | 'info' | 'default' => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'success'
    case 'POST':
      return 'primary'
    case 'PUT':
      return 'warning'
    case 'PATCH':
      return 'warning'
    case 'DELETE':
      return 'error'
    default:
      return 'default'
  }
}

const EditRole = ({ open, onClose, idRole, page, pageSize }: EditRoleProps) => {
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Permissions
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const permissionsRef = useRef<Permission[] | null>(null)

  // Fetch role detail + all permissions - chỉ gọi khi open hoặc idRole thay đổi
  useEffect(() => {
    if (!idRole || !open) return

    const fetchData = async () => {
      try {
        setIsFetching(true)

        // Nếu đã có permissions, chỉ fetch role detail
        let perms = permissionsRef.current
        let roleRes

        if (permissionsRef.current) {
          roleRes = await getRoleById(idRole)
        } else {
          // Nếu chưa có permissions, fetch cả hai
          const [newRoleRes, permRes] = await Promise.all([getRoleById(idRole), getPermission()])
          roleRes = newRoleRes
          perms = permRes.data?.data || permRes.data || []
          permissionsRef.current = perms
        }

        const roleData = roleRes.data
        setName(roleData.name || '')
        setDescription(roleData.description || '')
        setIsActive(roleData.isActive ?? true)

        // Set selected permission IDs từ role hiện tại
        const currentPermIds = (roleData.permissions || []).map((p: Permission) => p.id)
        setSelectedPermissionIds(currentPermIds)

        // Set all permissions
        setAllPermissions(perms || [])

        // Expand tất cả module mặc định
        const grouped = groupPermissionsByModule(perms || [])
        const expanded: Record<string, boolean> = {}
        Object.keys(grouped).forEach(mod => {
          expanded[mod] = true
        })
        setExpandedModules(expanded)
      } catch (error: any) {
        toast.error(t('Failed to load role data'))
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [idRole, open, t])

  // Toggle một permission
  const handleTogglePermission = (permId: number) => {
    setSelectedPermissionIds(prev => (prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]))
  }

  // Toggle tất cả permission trong một module
  const handleToggleModule = (modulePerms: Permission[]) => {
    const moduleIds = modulePerms.map(p => p.id)
    const allSelected = moduleIds.every(id => selectedPermissionIds.includes(id))

    if (allSelected) {
      setSelectedPermissionIds(prev => prev.filter(id => !moduleIds.includes(id)))
    } else {
      setSelectedPermissionIds(prev => Array.from(new Set([...prev, ...moduleIds])))
    }
  }

  // Toggle select all
  const handleSelectAll = () => {
    if (selectedPermissionIds.length === allPermissions.length) {
      setSelectedPermissionIds([])
    } else {
      setSelectedPermissionIds(allPermissions.map(p => p.id))
    }
  }

  // Toggle expand module
  const handleToggleExpand = (module: string) => {
    setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }))
  }

  // Submit
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t('Role name is required'))

      return
    }
    try {
      setIsLoading(true)
      await updateRole(idRole, {
        name: name.trim(),
        description: description.trim(),
        isActive,
        permissionIds: selectedPermissionIds
      })
      toast.success(t('Update role successfully'))
      dispatch(getAllRolesAsync({ params: { page, limit: pageSize } }))
      onClose()
    } catch (error: any) {
      if (error?.response?.data?.error === 'Forbidden') {
        toast.error(
          t('You do not have permission to perform this action. Because it defaults to one of the three roles.')
        )
        onClose()

        return
      }
      toast.error(
        error?.response?.data?.message?.[0]?.error || error?.response?.data?.message || t('An error occurred')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const groupedPermissions = groupPermissionsByModule(allPermissions)

  return (
    <CustomModal open={open} onClose={onClose} title={t('Edit Role & Permissions')} maxWidth={700}>
      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
          {/* Name */}
          <TextField
            label={t('Name')}
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
            size='small'
          />

          {/* Description */}
          <TextField
            label={t('Description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            disabled={isLoading}
            size='small'
          />

          {/* isActive */}
          <FormControlLabel
            control={<Switch checked={isActive} onChange={e => setIsActive(e.target.checked)} disabled={isLoading} />}
            label={t('Active')}
          />

          {/* Permissions Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant='subtitle1' fontWeight='bold'>
                {t('Permissions')} ({selectedPermissionIds.length}/{allPermissions.length})
              </Typography>
              <Button size='small' variant='outlined' onClick={handleSelectAll}>
                {selectedPermissionIds.length === allPermissions.length ? t('Deselect All') : t('Select All')}
              </Button>
            </Box>

            <Box
              sx={{
                maxHeight: 400,
                overflow: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1
              }}
            >
              {Object.entries(groupedPermissions).map(([module, perms]) => {
                const moduleIds = perms.map(p => p.id)
                const selectedCount = moduleIds.filter(id => selectedPermissionIds.includes(id)).length
                const allSelected = selectedCount === perms.length
                const someSelected = selectedCount > 0 && !allSelected

                return (
                  <Box key={module} sx={{ mb: 1 }}>
                    {/* Module header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                      onClick={() => handleToggleExpand(module)}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={() => handleToggleModule(perms)}
                        onClick={e => e.stopPropagation()}
                        size='small'
                        disabled={isLoading}
                      />
                      <Typography variant='subtitle2' fontWeight='bold' sx={{ flex: 1, textTransform: 'capitalize' }}>
                        {module}
                      </Typography>
                      <Chip
                        label={`${selectedCount}/${perms.length}`}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                      {expandedModules[module] ? (
                        <ExpandLessIcon fontSize='small' />
                      ) : (
                        <ExpandMoreIcon fontSize='small' />
                      )}
                    </Box>

                    {/* Permission items */}
                    <Collapse in={expandedModules[module]}>
                      <Box sx={{ pl: 3 }}>
                        {perms.map(perm => (
                          <Box
                            key={perm.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              py: 0.25,
                              '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                            }}
                          >
                            <Checkbox
                              checked={selectedPermissionIds.includes(perm.id)}
                              onChange={() => handleTogglePermission(perm.id)}
                              size='small'
                              disabled={isLoading}
                            />
                            <Chip
                              label={perm.method}
                              size='small'
                              color={getMethodColor(perm.method)}
                              sx={{ minWidth: 60, mr: 1, fontWeight: 'bold', fontSize: '0.7rem' }}
                            />
                            <Typography variant='body2' sx={{ flex: 1 }}>
                              {perm.path}
                            </Typography>
                            {perm.description && (
                              <Typography variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                                {perm.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                )
              })}

              {allPermissions.length === 0 && (
                <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 2 }}>
                  {t('No permissions found')}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button variant='outlined' onClick={onClose} disabled={isLoading}>
              {t('Cancel')}
            </Button>
            <Button variant='contained' onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                  {t('Saving')}...
                </Box>
              ) : (
                t('Update')
              )}
            </Button>
          </Box>
        </Box>
      )}
    </CustomModal>
  )
}

export default EditRole
