// ** MUI Imports
import { Box, Button, Divider, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Next Imports
import { NextPage } from 'next/types'

// ** React Imports
import React, { useCallback, useEffect, useMemo } from 'react'

// ** Components Imports
import { CustomDataGrid, IconifyIcon, SearchBar } from 'src/components'

// ** Types Imports
import { UserTableRow } from 'src/types/user'

// ** Translation Import
import { useTranslation } from 'react-i18next'

// ** Hooks
import { formatDate } from 'src/helpers/time'
import useDebounce from 'src/hooks/useDebounce'
import { useAuth } from 'src/hooks/useAuth'
import { GetCategory } from 'src/service/category'
import { buildAbilityFor } from 'src/configs/acl'
import { METHOD_MAP } from 'src/configs/method'
import { MODULES } from 'src/configs/module'
import CreateCategories from './components/category/CreateCategory'
import DeleteCategory from './components/category/DeleteCategory'
import UpdateCategoryComponent from './components/category/UpdateCategory'

type TProps = {}

type Category = {
  id: number
  name: string
  logo: string
  parentCategoryId?: number
  [key: string]: any
}

const CategoriesPage: NextPage<TProps> = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [dataUser, setDataUser] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [isOpenCreateUser, setIsOpenCreateUser] = React.useState(false)
  const [isOpenUpdateUser, setIsOpenUpdateUser] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<Category | null>(null)
  const [isOpenDeleteUser, setIsOpenDeleteUser] = React.useState(false)
  const [filterRole, setFilterRole] = React.useState<string>('')
  const [filterStatus, setFilterStatus] = React.useState<string>('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { t } = useTranslation()
  const auth = useAuth()

  const ability = useMemo(() => {
    if (!auth.user) return null
    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth])

  const canCreate = ability?.can(METHOD_MAP.POST, MODULES.CATEGORY)
  const canUpdate = ability?.can(METHOD_MAP.PUT, MODULES.CATEGORY)
  const canDelete = ability?.can(METHOD_MAP.DELETE, MODULES.CATEGORY)

  const userColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 300,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={params.row.logo || '/images/default-product.png'}
            alt={params.value}
            style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
          />
          {params.value}
        </Box>
      )
    },
    { field: 'updateAt', headerName: t('Update At'), width: 220 },
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
            onClick={() => canDelete && handleOpenDelete(params.row.id, params.row.name)}
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
      const response = await GetCategory(undefined)

      const tableData: UserTableRow[] = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.categoryTranslations[0]?.name || item.name || 'N/A', // Assuming translations is an array and we take the first one
        logo: item.logo,
        updateAt: formatDate(item.updatedAt),
        _original: item
      }))

      setDataUser(tableData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filterRole, filterStatus])

  useEffect(() => {
    handleRefreshTable()
  }, [handleRefreshTable])

  const handleOpenCreate = () => {
    setIsOpenCreateUser(true)
  }

  const handleOpenUpdate = (row: any) => {
    const categoryData = row._original || row
    setSelectedUser(categoryData)
    setIsOpenUpdateUser(true)
  }

  const handleOpenDelete = (userId: number, name: string) => {
    setSelectedUser({ id: userId, name } as any)
    setIsOpenDeleteUser(true)
  }

  const handleResetSearch = () => {
    setSearchTerm('')
  }

  const handleClearFilter = () => {
    setFilterRole('')
    setFilterStatus('')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box>
        {/* Table Users */}
        <Box sx={{ mt: 4 }}>
          <Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2, pt: 2 }}>
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
                  {t('Add Category')}
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
              hideFooter
            />
          </Paper>
        </Box>
      </Box>

      <UpdateCategoryComponent
        open={isOpenUpdateUser}
        onClose={() => setIsOpenUpdateUser(false)}
        category={selectedUser}
        onUpdated={handleRefreshTable}
      />

      <CreateCategories
        open={isOpenCreateUser}
        onClose={() => setIsOpenCreateUser(false)}
        onCreated={handleRefreshTable}
      />

      <DeleteCategory
        open={isOpenDeleteUser}
        onClose={() => setIsOpenDeleteUser(false)}
        data={selectedUser || { id: 0, name: '' }}
        onDeleted={handleRefreshTable}
      />
    </Box>
  )
}

export default CategoriesPage
