import { Box, Grid, IconButton, Paper } from '@mui/material'
import { GridAddIcon } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import CustomWelcome from 'src/components/CustomWelcome'
import SearchBar from 'src/components/SearchBar'
import { buildAbilityFor } from 'src/configs/acl'
import { METHOD_MAP } from 'src/configs/method'
import { MODULES } from 'src/configs/module'
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { useAuth } from 'src/hooks/useAuth'
import useDebounce from 'src/hooks/useDebounce'
import { AppDispatch } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'
import CreateRole from '../components/role-user/CreateRole'
import PermissionMatrix from '../components/role-user/PermissionMatrix'
import TableRole from '../components/role-user/TableRole'

type TProps = {}

const UsersRolePage: NextPage<TProps> = () => {
  const { t } = useTranslation()

  // UI state
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [openCreateRole, setOpenCreateRole] = useState(false)
  const auth = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useMemo(() => {
    if (!auth.user) return null

    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth])

  const canCreate = ability?.can(METHOD_MAP.POST, MODULES.ROLE)

  // Debounce value (chỉ dùng cho Table / API)
  const debouncedSearch = useDebounce(searchValue, 300)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    setPage(1)
  }

  const handleReset = () => {
    setSearchValue('')
    setPage(1)
  }

  const handleRefreshTable = () => {
    setSearchValue('')
    setPage(1)
    dispatch(getAllRolesAsync({ params: { page, limit: pageSize } }))
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 5 }}>
        <CustomWelcome>{t('Manage User Roles')}</CustomWelcome>

        <Grid container spacing={2}>
          {/* Search + Create */}
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} sm='auto'>
                <SearchBar value={searchValue} onChange={handleSearch} onReset={handleReset} />
              </Grid>

              <Grid item xs='auto'>
                <IconButton
                  color='primary'
                  onClick={() => canCreate && setOpenCreateRole(true)}
                  sx={{
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    backgroundColor: '#e3f2fd',
                    pointerEvents: canCreate ? 'auto' : 'none',
                    opacity: canCreate ? 1 : 0.5
                  }}
                >
                  <GridAddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          {/* Table */}
          <Grid item xs={12} lg={6}>
            <TableRole
              search={debouncedSearch}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Grid>

          {/* Info + Permission Matrix */}
          <Grid item xs={12} lg={6}>
            <PermissionMatrix page={page} pageSize={pageSize} />
          </Grid>
        </Grid>
      </Paper>

      <CreateRole open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreated={handleRefreshTable} />
    </Box>
  )
}

export default UsersRolePage
