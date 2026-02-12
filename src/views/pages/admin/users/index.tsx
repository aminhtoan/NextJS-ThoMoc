import { Box, Divider, Grid, Icon, Paper } from '@mui/material'
import { NextPage } from 'next/types'
import React from 'react'
import StatCard from './components/UserStatCard'
import IconifyIcon from 'src/components/Icon'
import { STATCARD_USER } from 'src/configs/user'
import CustomDataGrid from 'src/components/CustomDataGrid/CustomDataGrid'
import CustomSelect from 'src/components/CustomSelect'
import SearchBar from 'src/components/SearchBar/SearchBar'
import CustomPagination from 'src/components/CustomPagination'
import { PAGINATION_CONFIG } from 'src/configs/pagination'

const fakeUserData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', actions: 'Action' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', actions: 'Action' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', actions: 'Action' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', actions: 'Action' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', actions: 'Action' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', actions: 'Action' }
]

const userColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'role', headerName: 'Role', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'actions', headerName: 'Actions', width: 150 }
]

type TProps = {}
const UsersPage: NextPage<TProps> = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const totalItems = fakeUserData.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newSize: number) => {
    setPageSize(newSize)
  }

  const PaginationComponent = () => (
    <CustomPagination
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
      onPageChange={onPageChange}
      onPageSizeChange={newSize => {
        onPageSizeChange(newSize)
        onPageChange(1)
      }}
    />
  )
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

              <Box>
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
                  Add User
                </Box>
              </Box>
            </Box>
            <Divider />
            <CustomDataGrid
              rows={fakeUserData}
              columns={userColumns}
              getRowId={row => row.id}
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              autoHeight
              slots={{
                pagination: () => (
                  <CustomPagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
                    onPageChange={onPageChange}
                    onPageSizeChange={newSize => {
                      onPageSizeChange(newSize)
                      onPageChange(1)
                    }}
                  />
                )
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default UsersPage
