import { Box, Grid, IconButton, Paper } from '@mui/material'
import { GridAddIcon } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomWelcome from 'src/components/CustomWelcome/CustomWelcome'
import SearchBar from 'src/components/SearchBar/SearchBar'
import CreateRole from '../components/CreateRole'
import TableRole from '../components/TableRole'

type TProps = {}

const UsersRolePage: NextPage<TProps> = () => {
  const [searchValue, setSearchValue] = useState('')
  const [openCreateRole, setOpenCreateRole] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { t } = useTranslation()

  // const [idRoleEdit, setIdRoleEdit] = useState<number | undefined>(undefined)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleReset = () => {
    setSearchValue('')
  }

  const handleRefreshTable = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <Box sx={{ p: 3, height: 'auto' }}>
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
                  sx={{
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    backgroundColor: '#e3f2fd'
                  }}
                >
                  <GridAddIcon onClick={() => setOpenCreateRole(true)} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          {/* Table */}
          <Grid item xs={12} lg={6}>
            <TableRole key={refreshKey} />
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
