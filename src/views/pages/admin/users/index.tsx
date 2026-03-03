// ** MUI Imports
import { Box, Button, Divider, Grid, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Next Imports
import { NextPage } from 'next/types'

// ** React Imports
import React, { useCallback, useEffect, useMemo } from 'react'

// ** Components Imports
import { CustomDataGrid, CustomPagination, CustomSelect, CustomTag, IconifyIcon, SearchBar } from 'src/components'

// ** Configs Imports
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { STATCARD_USER } from 'src/configs/user'
import { METHOD_MAP } from 'src/configs/method'
import { MODULES } from 'src/configs/module'
import { buildAbilityFor } from 'src/configs/acl'

// ** Service Imports
import { fetchUsers } from 'src/service/user'

// ** Types Imports
import { User, UserTableRow } from 'src/types/user'
import { getAllRoles } from 'src/service/role'

// ** Components User Imports
import { CreateUser, StatCard, DeleteUser, UpdateUser } from './components/users'

// ** Translation Import
import { useTranslation } from 'react-i18next'

// ** Hooks
import useDebounce from 'src/hooks/useDebounce'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

const UsersPage: NextPage<TProps> = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [dataUser, setDataUser] = React.useState<UserTableRow[]>([])
  const [loading, setLoading] = React.useState(false)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalItems, setTotalItems] = React.useState(0)
  const [isOpenCreateUser, setIsOpenCreateUser] = React.useState(false)
  const [isOpenUpdateUser, setIsOpenUpdateUser] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isOpenDeleteUser, setIsOpenDeleteUser] = React.useState(false)
  const [filterRole, setFilterRole] = React.useState<string>('')
  const [filterStatus, setFilterStatus] = React.useState<string>('')
  const [dataRole, setDataRole] = React.useState<Array<{ value: string; label: string }>>([])

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { t } = useTranslation()
  const auth = useAuth()

  const ability = useMemo(() => {
    if (!auth.user) return null
    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth])

  const canCreate = ability?.can(METHOD_MAP.POST, MODULES.PROFILE)
  const canUpdate = ability?.can(METHOD_MAP.PUT, MODULES.PROFILE)
  const canDelete = ability?.can(METHOD_MAP.DELETE, MODULES.PROFILE)

  const userColumns: GridColDef<UserTableRow>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 180,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={params.row.avatar}
            alt={params.value}
            style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
          />
          {params.value}
        </Box>
      )
    },
    { field: 'email', headerName: t('Email'), width: 220 },
    { field: 'phoneNumber', headerName: t('Phone'), width: 150 },
    { field: 'roleName', headerName: t('Role'), width: 120 },
    {
      field: 'status',
      headerName: t('Status'),
      width: 150,
      renderCell: params => {
        let bgcolor = ''
        let color = ''
        let label = ''
        if (params.value === 'ACTIVE') {
          bgcolor = 'rgba(28, 187, 140, .15)'
          color = '#1cbb8c'
          label = t('Active')
        } else if (params.value === 'BLOCKED') {
          bgcolor = 'rgba(220, 53, 69, .15)'
          color = '#dc3545'
          label = t('Blocked')
        } else {
          bgcolor = 'rgba(255, 193, 7, .15)'
          color = '#ffc107'
          label = t('Inactive')
        }

        return (
          <CustomTag bgcolor={bgcolor} color={color}>
            {label}
          </CustomTag>
        )
      }
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      width: 140,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{ cursor: canUpdate ? 'pointer' : 'not-allowed', opacity: canUpdate ? 1 : 0.5 }}
            onClick={() => canUpdate && handleOpenUpdate(params.row)}
          >
            <IconifyIcon icon='tabler:pencil' />
          </Box>
          <Box
            sx={{ cursor: canDelete ? 'pointer' : 'not-allowed', opacity: canDelete ? 1 : 0.5 }}
            onClick={() => canDelete && handleOpenDelete(params.row.id, params.row.email)}
          >
            <IconifyIcon icon='tabler:trash' />
          </Box>
          <Box sx={{ cursor: 'pointer' }}>
            <IconifyIcon icon='tabler:eye' />
          </Box>
        </Box>
      )
    }
  ]

  const handleRefreshTable = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchUsers(page, pageSize, debouncedSearch, filterRole, filterStatus)

      // Transform API data to table format
      const tableData: UserTableRow[] = response.data.map((user: User) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        roleName: user.role?.name || 'N/A',
        roleId: user.roleId,
        status: user.status === 'ACTIVE' ? 'ACTIVE' : user.status === 'BLOCKED' ? 'BLOCKED' : 'INACTIVE'
      }))

      setDataUser(tableData)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, filterRole, filterStatus])

  useEffect(() => {
    handleRefreshTable()
  }, [handleRefreshTable])

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newSize: number) => {
    setPage(1) // Reset to first page
    setPageSize(newSize)
  }

  const handleOpenCreate = () => {
    setIsOpenCreateUser(true)
  }

  const handleOpenUpdate = (user: UserTableRow) => {
    setSelectedUser(user as unknown as User)
    setIsOpenUpdateUser(true)
  }

  const handleOpenDelete = (userId: number, email: string) => {
    setSelectedUser({ id: userId, email } as User)
    setIsOpenDeleteUser(true)
  }

  const handleResetSearch = () => {
    setSearchTerm('')
  }

  const handleFilterRole = useCallback(async () => {
    const { data } = await getAllRoles({ page: 1, limit: 100, search: '' })
    setDataRole(data.data.map((role: any) => ({ id: String(role.id), name: role.name })))
  }, [])

  useEffect(() => {
    handleFilterRole()
  }, [handleFilterRole])

  const handleClearFilter = () => {
    setFilterRole('')
    setFilterStatus('')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {STATCARD_USER.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              percent={card.percent}
              color={card.color}
              icon={<IconifyIcon icon={card.icon} />}
              caption={card.caption}
            />
          </Grid>
        ))}
      </Grid>
      <Box>
        {/* Table Users */}
        <Box sx={{ mt: 4 }}>
          <Paper>
            {/* filter */}
            <Grid container spacing={2} sx={{ p: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <CustomSelect
                  placeholder={t('Filter by role')}
                  options={dataRole}
                  value={filterRole}
                  onChange={value => setFilterRole(value as string)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CustomSelect
                  placeholder={t('Filter by status')}
                  options={[
                    { id: 'ACTIVE', name: t('Active') },
                    { id: 'INACTIVE', name: t('Inactive') },
                    { id: 'BLOCKED', name: t('Blocked') }
                  ]}
                  value={filterStatus}
                  onChange={value => setFilterStatus(value as string)}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2 }}>
              <Box>
                <Button onClick={handleClearFilter} sx={{ height: '100%' }}>
                  <IconifyIcon icon='mdi:refresh' />
                </Button>
              </Box>
              <Box>
                <SearchBar
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onReset={handleResetSearch}
                />
              </Box>

              <Box onClick={() => canCreate && handleOpenCreate()}>
                <Box
                  component='button'
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#fff',
                    border: 'none',
                    height: 38,
                    borderRadius: 0.5,
                    px: 2,
                    py: 1.25,
                    cursor: canCreate ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pointerEvents: canCreate ? 'auto' : 'none',
                    opacity: canCreate ? 1 : 0.5,
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  <IconifyIcon icon='mdi:plus' />
                  {t('Add User')}
                </Box>
              </Box>
            </Box>

            <Divider />

            <CustomDataGrid
              rows={dataUser}
              columns={userColumns}
              getRowId={row => row.id}
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              autoHeight
              loading={loading}
              slots={{
                pagination: () => (
                  <CustomPagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                  />
                )
              }}
            />
          </Paper>
        </Box>
      </Box>

      <UpdateUser
        open={isOpenUpdateUser}
        onClose={() => setIsOpenUpdateUser(false)}
        user={selectedUser}
        onUpdated={handleRefreshTable}
      />

      <CreateUser open={isOpenCreateUser} onClose={() => setIsOpenCreateUser(false)} onCreated={handleRefreshTable} />

      <DeleteUser
        open={isOpenDeleteUser}
        onClose={() => setIsOpenDeleteUser(false)}
        data={selectedUser || { id: 0, email: '' }}
        onDeleted={handleRefreshTable}
      />
    </Box>
  )
}

export default UsersPage
