// ** MUI Imports
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

// ** React Imports
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { buildAbilityFor } from 'src/configs/acl'

// ** Translation
import { useTranslation } from 'react-i18next'

// ** Toast
import toast from 'react-hot-toast'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'

// ** Services
import { getPermission } from 'src/service/permission'
import { getRoleById, updateRole } from 'src/service/role'

// ** Types
import { Permission } from 'src/types/role'
import { METHOD_COLUMNS, METHOD_MAP, MethodKey } from 'src/configs/method'
import { GROUP_CONFIG } from 'src/configs/group-permission'
import { normaliseMethod } from 'src/helpers/method'
import MODULE_LABELS from 'src/configs/module'

interface ModuleRow {
  module: string
  label: string
  byMethod: Partial<Record<MethodKey, number[]>>
  allIds: number[]
}

interface GroupData {
  key: string
  label: string
  modules: ModuleRow[]
  allIds: number[]
}

/** Build the hierarchical group → module → method structure */
const buildGroups = (permissions: Permission[]): GroupData[] => {
  // 1. index by module → method → ids
  const moduleMap = new Map<string, ModuleRow>()
  for (const p of permissions) {
    const mod = p.module.toUpperCase()
    if (!moduleMap.has(mod)) {
      moduleMap.set(mod, {
        module: mod,
        label: MODULE_LABELS[mod] || mod,
        byMethod: {},
        allIds: []
      })
    }
    const row = moduleMap.get(mod)!
    const normMethod = normaliseMethod(p.method)
    if (!row.byMethod[normMethod]) row.byMethod[normMethod] = []
    row.byMethod[normMethod]!.push(p.id)
    row.allIds.push(p.id)
  }

  // 2. assign modules to groups
  const assignedModules = new Set<string>()
  const groups: GroupData[] = []

  for (const cfg of GROUP_CONFIG) {
    const mods: ModuleRow[] = []
    for (const modName of cfg.modules) {
      const row = moduleMap.get(modName)
      if (row) {
        mods.push(row)
        assignedModules.add(modName)
      }
    }
    if (mods.length > 0) {
      groups.push({
        key: cfg.key,
        label: cfg.label,
        modules: mods,
        allIds: mods.flatMap(m => m.allIds)
      })
    }
  }

  // 3. any remaining modules go to "Khác"
  const remaining: ModuleRow[] = []
  moduleMap.forEach((row, modName) => {
    if (!assignedModules.has(modName)) remaining.push(row)
  })
  if (remaining.length > 0) {
    groups.push({
      key: 'other',
      label: 'other',
      modules: remaining,
      allIds: remaining.flatMap(m => m.allIds)
    })
  }

  return groups
}

// ============== STYLES ==============

const headerCellSx = {
  fontWeight: 700,
  textAlign: 'center' as const,
  py: 1.5,
  px: 1,
  fontSize: '0.8rem',
  textTransform: 'uppercase' as const,
  color: 'text.secondary',
  borderBottom: '2px solid',
  borderColor: 'divider'
}

const groupRowSx = {
  '& td': { py: 1, borderBottom: '1px solid', borderColor: 'divider' }
}

const childRowSx = {
  '& td': { py: 0.5, borderBottom: '1px solid', borderColor: 'divider' },
  '&:hover': { bgcolor: 'action.hover' }
}

const checkboxCellSx = {
  textAlign: 'center' as const,
  px: 0.5
}

// ============== COMPONENT ==============

const PermissionMatrix = ({ page, pageSize }: { page: number; pageSize: number }) => {
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const auth = useAuth()
  const ability = useMemo(() => {
    if (!auth.user) return null

    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth.user])

  // Redux: preloaded role list
  const rolesFromStore = useSelector((state: RootState) => state.role.roles.data) as any[]

  // Local state
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Nếu không có quyền xem thì không fetch API, data rỗng
  useEffect(() => {
    if (!ability) return

    if (!ability.can(METHOD_MAP.GET, 'ROLE')) {
      setAllPermissions([])

      return
    }
    dispatch(getAllRolesAsync({ params: { page: page, limit: pageSize } }))
  }, [dispatch, page, pageSize, ability])

  // Fetch all permissions: chỉ gọi khi đã có ability và có quyền xem
  const fetchPermissions = useCallback(async () => {
    if (!ability) return
    if (!ability.can(METHOD_MAP.GET, 'ROLE')) {
      setAllPermissions([])

      return
    }
    try {
      setLoading(true)
      const res = await getPermission()
      const perms: Permission[] = res.data?.data || res.data || []
      setAllPermissions(perms)
    } catch (error: any) {
      // toast.error(t('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [ability, t])

  // Chỉ gọi fetchPermissions khi đã có ability và có quyền xem
  useEffect(() => {
    if (!ability) return
    if (!ability.can(METHOD_MAP.GET, 'ROLE')) {
      setAllPermissions([])

      return
    }
    fetchPermissions()
  }, [ability, fetchPermissions])

  // When a role is selected, load its permissions
  useEffect(() => {
    if (!selectedRoleId) {
      setSelectedIds(new Set())

      return
    }
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await getRoleById(selectedRoleId as number)
        const role = res.data
        const ids = (role.permissions || []).map((p: Permission) => p.id)
        setSelectedIds(new Set(ids))
      } catch (error) {
        console.log(error)
        toast.error(t('An error occurred'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId])

  // Build groups from permissions
  const groups = useMemo(() => buildGroups(allPermissions), [allPermissions])

  // ---- Toggle helpers ----

  const toggleIds = useCallback((ids: number[], forceOn?: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      const allOn = forceOn !== undefined ? !forceOn : ids.every(id => next.has(id))
      if (allOn) {
        ids.forEach(id => next.delete(id))
      } else {
        ids.forEach(id => next.add(id))
      }

      return next
    })
  }, [])

  /** Toggle a single method cell for one module */
  const handleToggleCell = useCallback(
    (ids: number[]) => {
      if (ids.length === 0) return
      toggleIds(ids)
    },
    [toggleIds]
  )

  /** Toggle ALL for a group (header row) */
  const handleToggleGroupAll = useCallback(
    (group: GroupData) => {
      toggleIds(group.allIds)
    },
    [toggleIds]
  )

  /** Toggle ALL for a single module row */
  const handleToggleModuleAll = useCallback(
    (mod: ModuleRow) => {
      toggleIds(mod.allIds)
    },
    [toggleIds]
  )

  // Are all ids in set?
  const allChecked = useCallback(
    (ids: number[]) => ids.length > 0 && ids.every(id => selectedIds.has(id)),
    [selectedIds]
  )
  const someChecked = useCallback(
    (ids: number[]) => ids.some(id => selectedIds.has(id)) && !ids.every(id => selectedIds.has(id)),
    [selectedIds]
  )

  // Save
  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.error(t('Please select a role'))

      return
    }
    try {
      setSaving(true)
      await updateRole(selectedRoleId as number, { permissionIds: Array.from(selectedIds) })
      toast.success(t('Update role successfully'))
      dispatch(getAllRolesAsync({ params: { page: 1, limit: 10 } }))
      await fetchPermissions()
    } catch (err: any) {
      if (err?.response?.data?.error === 'Forbidden') {
        toast.error(
          t('You do not have permission to perform this action. Because it defaults to one of the three roles.')
        )

        return
      }
      toast.error(err?.response?.data?.message?.[0]?.error || err?.response?.data?.message || t('An error occurred'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Role selector */}
      <Box
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <FormControl size='small' sx={{ minWidth: 200 }}>
          <InputLabel>{t('Role')}</InputLabel>
          <Select value={selectedRoleId} label={t('Role')} onChange={e => setSelectedRoleId(e.target.value as number)}>
            <MenuItem value=''>
              <em>-- {t('Select')} --</em>
            </MenuItem>
            {rolesFromStore.map((role: any) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='contained'
          size='small'
          startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={!selectedRoleId || saving || loading}
        >
          {saving ? `${t('Saving')}...` : t('Save')}
        </Button>
      </Box>

      {/* Matrix table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, textAlign: 'left', minWidth: 180 }}>{t('Name')}</TableCell>
                {METHOD_COLUMNS.map(col => (
                  <TableCell key={col.key} sx={{ ...headerCellSx, width: 80 }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {groups.map(group => (
                <React.Fragment key={`group-${group.key}`}>
                  {/* ── Group header row ── */}
                  <TableRow key={`g-${group.key}`} sx={groupRowSx}>
                    <TableCell>
                      <Typography variant='subtitle2' sx={{ fontWeight: 700, color: 'primary.main', pl: 0.5 }}>
                        {t(group.label)}
                      </Typography>
                    </TableCell>

                    {/* ALL column for group */}
                    <TableCell sx={checkboxCellSx}>
                      <Checkbox
                        size='small'
                        checked={allChecked(group.allIds)}
                        indeterminate={someChecked(group.allIds)}
                        onChange={() => handleToggleGroupAll(group)}
                        disabled={!selectedRoleId}
                      />
                    </TableCell>

                    {/* Empty cells for method columns on group header */}
                    {(['GET', 'POST', 'PUT', 'DELETE'] as const).map(m => (
                      <TableCell key={m} sx={checkboxCellSx} />
                    ))}
                  </TableRow>

                  {/* ── Child module rows ── */}
                  {group.modules.map(mod => (
                    <TableRow key={`m-${mod.module}`} sx={childRowSx}>
                      <TableCell>
                        <Typography variant='body2' sx={{ pl: 3 }}>
                          {t(mod.label)}
                        </Typography>
                      </TableCell>

                      {/* ALL for this module */}
                      <TableCell sx={checkboxCellSx}>
                        <Checkbox
                          size='small'
                          checked={allChecked(mod.allIds)}
                          indeterminate={someChecked(mod.allIds)}
                          onChange={() => handleToggleModuleAll(mod)}
                          disabled={!selectedRoleId}
                        />
                      </TableCell>

                      {/* Method checkboxes */}
                      {(['GET', 'POST', 'PUT', 'DELETE'] as MethodKey[]).map(method => {
                        const ids = mod.byMethod[method] || []

                        return (
                          <TableCell key={method} sx={checkboxCellSx}>
                            {ids.length > 0 ? (
                              <Checkbox
                                size='small'
                                checked={allChecked(ids)}
                                indeterminate={someChecked(ids)}
                                onChange={() => handleToggleCell(ids)}
                                disabled={!selectedRoleId}
                              />
                            ) : null}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}

              {groups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {t('No permissions found')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  )
}

export default PermissionMatrix
