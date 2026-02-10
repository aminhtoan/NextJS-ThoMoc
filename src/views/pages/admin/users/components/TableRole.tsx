// ** MUI
import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** React Imports
import { useEffect, useState } from 'react'

// ** Translation Import
import { useTranslation } from 'react-i18next'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components
import CustomTag from 'src/components/custom-tag'
import CustomDataGrid from 'src/components/CustomDataGrid/CustomDataGrid'
import CustomPagination from 'src/components/CustomPagination'

// ** Configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Store Imports
import { AppDispatch, RootState } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'
import DeleteRole from './DeleteRole'
import EditRole from './EditRole'

interface TableRoleProps {
  search?: string
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const TableRole = ({ search = '', page, pageSize, onPageChange, onPageSizeChange }: TableRoleProps) => {
  const dispatch: AppDispatch = useDispatch()
  const { data, totalItems, totalPages } = useSelector((state: RootState) => state.role.roles)
  const { t } = useTranslation()
  const [openDeleteRole, setOpenDeleteRole] = useState(false)
  const [deleteData, setDeleteData] = useState<{ id: number; name: string }>({ id: 0, name: '' })
  const [openEditRole, setOpenEditRole] = useState(false)
  const [editRoleId, setEditRoleId] = useState<number>(0)

  useEffect(() => {
    dispatch(getAllRolesAsync({ params: { page, limit: pageSize, search } }))
  }, [dispatch, page, pageSize, search])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 150,
      editable: true,
      renderCell: params => {
        const defaultRoles = ['ADMIN', 'CLIENT', 'SELLER']
        const isDefault = defaultRoles.includes((params.value || '').toUpperCase())
        return (
          <Box display='flex' alignItems='center'>
            {params.value}
            {isDefault && (
              <Box component='span' sx={{ color: 'warning.main', fontWeight: 'bold', ml: 0.5 }}>
                *
              </Box>
            )}
          </Box>
        )
      }
    },
    {
      field: 'isActive',
      headerName: t('Active'),
      type: 'boolean',
      width: 110,
      editable: true,
      renderCell: params => (
        <CustomTag
          bgcolor={params.value ? 'rgba(28, 187, 140, .15)' : 'rgba(220, 53, 69, .15)'}
          color={params.value ? '#1cbb8c' : '#dc3545'}
        >
          {params.value ? t('Active') : t('Inactive')}
        </CustomTag>
      )
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Box gap={1} display='flex'>
          <Box onClick={() => handleEdit(params.row.id)}>
            <CustomTag bgcolor='rgba(13, 110, 253, .15)' color='#0d6efd'>
              {t('Edit')}
            </CustomTag>
          </Box>
          <Box onClick={() => handleDelete(params.row)}>
            <CustomTag bgcolor='rgba(220, 53, 69, .15)' color='#dc3545'>
              {t('Delete')}
            </CustomTag>
          </Box>
        </Box>
      )
    }
  ]

  const handleEdit = (id: any) => {
    setEditRoleId(id)
    setOpenEditRole(true)
  }

  const handleDelete = (data: { id: number; name: string }) => {
    setOpenDeleteRole(true)
    setDeleteData({ id: data.id, name: data.name })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <CustomDataGrid
        rows={data}
        getRowId={row => row.id}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        rowCount={totalItems}
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

      <DeleteRole
        open={openDeleteRole}
        onClose={() => setOpenDeleteRole(false)}
        data={deleteData}
        page={page}
        pageSize={pageSize}
      />
      {editRoleId > 0 && (
        <EditRole
          open={openEditRole}
          onClose={() => {
            setOpenEditRole(false)
            setEditRoleId(0)
          }}
          idRole={editRoleId}
          page={page}
          pageSize={pageSize}
        />
      )}
    </Box>
  )
}

export default TableRole
