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

// ** Configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Store Imports
import { AppDispatch, RootState } from 'src/stores'
import { getAllRolesAsync } from 'src/stores/apps/role/actions'
import DeleteRole from './DeleteRole'

const TableRole = () => {
  const dispatch: AppDispatch = useDispatch()
  const { data, totalItems } = useSelector((state: RootState) => state.role.roles)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[0])
  const { t } = useTranslation()
  const [openDeleteRole, setOpenDeleteRole] = useState(false)
  const [deleteData, setDeleteData] = useState<{ id: number; name: string }>({ id: 0, name: '' })

  useEffect(() => {
    dispatch(getAllRolesAsync({ params: { page, limit: pageSize } }))
  }, [dispatch, page, pageSize])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 150,
      editable: true
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
    console.log('ID cần Edit:', id)
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
        paginationModel={{
          pageSize: pageSize,
          page: page - 1
        }}
        pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
        onPaginationModelChange={model => {
          setPage(model.page + 1)
          setPageSize(model.pageSize)
        }}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        rowCount={totalItems}
        paginationMode='server'
        localeText={{
          MuiTablePagination: {
            labelRowsPerPage: t('Rows per page:')
          }
        }}
      />
      <DeleteRole open={openDeleteRole} onClose={() => setOpenDeleteRole(false)} data={deleteData} />
    </Box>
  )
}

export default TableRole
