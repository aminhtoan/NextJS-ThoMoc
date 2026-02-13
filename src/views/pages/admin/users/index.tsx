// ** MUI Imports
import { Box, Divider, Grid, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Next Imports
import { NextPage } from 'next/types'

// ** React Imports
import React, { useCallback, useEffect } from 'react'

// ** Components Imports
import { CustomTag, CustomDataGrid, CustomPagination, CustomSelect, IconifyIcon, SearchBar } from 'src/components'

// ** Configs Imports
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { STATCARD_USER } from 'src/configs/user'

// ** Service Imports
import { fetchUsers } from 'src/service/user'

// ** Types Imports
import { User, UserTableRow } from 'src/types/user'

// ** Components User Imports
import { StatCard, CreateUser } from './components/users'

// ** Translation Import
import { useTranslation } from 'react-i18next'
import UpdateUser from './components/users/UpdateUser'
import DeleteUser from './components/users/DeleteUser'

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
  const { t } = useTranslation()

  const userColumns: GridColDef<UserTableRow>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 200,
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
      width: 100,
      renderCell: params => (
        <CustomTag
          bgcolor={params.value === 'ACTIVE' ? 'rgba(28, 187, 140, .15)' : 'rgba(220, 53, 69, .15)'}
          color={params.value === 'ACTIVE' ? '#1cbb8c' : '#dc3545'}
        >
          {params.value === 'ACTIVE' ? t('Active') : t('Inactive')}
        </CustomTag>
      )
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      width: 150,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenUpdate(params.row)}>
            <IconifyIcon icon='tabler:pencil' />
          </Box>
          <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenDelete(params.row.id, params.row.email)}>
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
      const response = await fetchUsers(page, pageSize)

      // Transform API data to table format
      const tableData: UserTableRow[] = response.data.map((user: User) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        roleName: user.role?.name || 'N/A',
        roleId: user.roleId,
        status: user.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
      }))

      setDataUser(tableData)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

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
                <CustomSelect />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CustomSelect />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <CustomSelect />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2 }}>
              <Box>
                <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </Box>

              <Box onClick={handleOpenCreate}>
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
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
