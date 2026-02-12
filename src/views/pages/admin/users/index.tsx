import { Box, Divider, Grid, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import React, { useEffect } from 'react'
import CustomTag from 'src/components/custom-tag'
import CustomDataGrid from 'src/components/CustomDataGrid/CustomDataGrid'
import CustomPagination from 'src/components/CustomPagination'
import CustomSelect from 'src/components/CustomSelect'
import IconifyIcon from 'src/components/Icon'
import SearchBar from 'src/components/SearchBar/SearchBar'
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { STATCARD_USER } from 'src/configs/user'
import { fetchUsers } from 'src/service/user'
import { User, UserTableRow } from 'src/types/user'
import StatCard from './components/users/UserStatCard'
import CreateUser from './components/users/CreateUser'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const userColumns: GridColDef<UserTableRow>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Name',
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
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    { field: 'roleName', headerName: 'Role', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: params => (
        <CustomTag
          bgcolor={params.value === 'Active' ? 'rgba(28, 187, 140, .15)' : 'rgba(220, 53, 69, .15)'}
          color={params.value === 'Active' ? '#1cbb8c' : '#dc3545'}
        >
          {params.value === 'Active' ? 'Active' : 'Inactive'}
        </CustomTag>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: params => (
        console.log(params),
        (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ cursor: 'pointer' }}>
              <IconifyIcon icon='tabler:pencil' />
            </Box>
            <Box sx={{ cursor: 'pointer' }}>
              <IconifyIcon icon='tabler:trash' />
            </Box>
            <Box sx={{ cursor: 'pointer' }}>
              <IconifyIcon icon='tabler:eye' />
            </Box>
          </Box>
        )
      )
    }
  ]

  useEffect(() => {
    handleRefreshTable()
  }, [page, pageSize])

  const handleRefreshTable = async () => {
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
        status: user.status === 'ACTIVE' ? 'Active' : 'Inactive'
      }))

      setDataUser(tableData)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

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

      <CreateUser open={isOpenCreateUser} onClose={() => setIsOpenCreateUser(false)} onCreated={handleRefreshTable} />
    </Box>
  )
}

export default UsersPage
