import { Grid, IconButton, Paper } from '@mui/material'
import { GridAddIcon } from '@mui/x-data-grid'
import { NextPage } from 'next/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import CustomWelcome from 'src/components/CustomWelcome/CustomWelcome'
import SearchBar from 'src/components/SearchBar'
import { AppDispatch } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'
import TableRole from './components/TableRole'

type TProps = {}

const UsersRolePage: NextPage<TProps> = () => {
  const dispatch: AppDispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleReset = () => {
    setSearchValue('')
  }

  useEffect(() => {
    handleGetListRole()
  }, [searchValue])

  const handleGetListRole = () => {
    dispatch(getAllRolesAsync({ params: { page: 1, limit: 10 } }))
  }

  return (
    <div style={{ padding: 24 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <CustomWelcome>Welcome to user roles</CustomWelcome>

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
                  <GridAddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          {/* Table */}
          <Grid item xs={12} lg={6}>
            <TableRole />
          </Grid>

          {/* Info */}
          <Grid item xs={12} lg={6}>
            <p>This is the user roles management page.</p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
export default UsersRolePage
