// ** MUI
import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** React Imports
import { useEffect, useState, useMemo } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { buildAbilityFor } from 'src/configs/acl'

// ** Translation Import
import { useTranslation } from 'react-i18next'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components
import { CustomTag } from 'src/components'
import CustomDataGrid from 'src/components/CustomDataGrid'
import CustomPagination from 'src/components/CustomPagination'

// ** Configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Store Imports
import { AppDispatch, RootState } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'
import DeleteRole from './DeleteRole'
import EditRole from './EditRole'
import { METHOD_MAP } from 'src/configs/method'

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

  // Lấy ability từ CASL
  const auth = useAuth()
  const ability = useMemo(() => {
    if (!auth.user) return null

    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth.user])

  useEffect(() => {
    dispatch(getAllRolesAsync({ params: { page, limit: pageSize, search } }))
  }, [dispatch, page, pageSize, search])

  const canCreate = ability?.can(METHOD_MAP.POST, 'ROLE')
  const canUpdate = ability?.can(METHOD_MAP.PUT, 'ROLE')
  const canDelete = ability?.can(METHOD_MAP.DELETE, 'ROLE')

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
          <Box
            onClick={() => canUpdate && handleEdit(params.row.id)}
            sx={{ pointerEvents: canUpdate ? 'auto' : 'none', opacity: canUpdate ? 1 : 0.5 }}
          >
            <CustomTag bgcolor='rgba(13, 110, 253, .15)' color='#0d6efd'>
              {t('Edit')}
            </CustomTag>
          </Box>
          <Box
            onClick={() => canDelete && handleDelete(params.row)}
            sx={{ pointerEvents: canDelete ? 'auto' : 'none', opacity: canDelete ? 1 : 0.5 }}
          >
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
      {/* Nút Thêm (Add) */}
      <Box mb={2}>
        <Box sx={{ display: 'inline-block', pointerEvents: canCreate ? 'auto' : 'none', opacity: canCreate ? 1 : 0.5 }}>
          {/* Thay thế nút Add của bạn ở đây, ví dụ: */}
          {/* <Button onClick={handleAdd}>Thêm</Button> */}
        </Box>
      </Box>
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
