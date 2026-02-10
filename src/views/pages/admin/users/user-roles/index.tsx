import { Box, Grid, IconButton, Paper } from '@mui/material'
import { GridAddIcon } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomWelcome from 'src/components/CustomWelcome/CustomWelcome'
import SearchBar from 'src/components/SearchBar/SearchBar'
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import useDebounce from 'src/hooks/useDebounce'

import CreateRole from '../components/CreateRole'
import TableRole from '../components/TableRole'

type TProps = {}

const UsersRolePage: NextPage<TProps> = () => {
  const { t } = useTranslation()

  // UI state
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[0])
  const [openCreateRole, setOpenCreateRole] = useState(false)

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
  }

  return (
    <Box sx={{ p: 3 }}>
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
                  onClick={() => setOpenCreateRole(true)}
                  sx={{
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    backgroundColor: '#e3f2fd'
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

          {/* Info */}
          <Grid item xs={12} lg={6}>
            <p>This is the user roles management page.</p>
          </Grid>
        </Grid>
      </Paper>

      <CreateRole open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreated={handleRefreshTable} />
    </Box>
  )
}

export default UsersRolePage
