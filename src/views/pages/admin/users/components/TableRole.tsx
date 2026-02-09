import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomTag from 'src/components/custom-tag'
import CustomDataGrid from 'src/components/CustomDataGrid/CustomDataGrid'
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { RootState } from 'src/stores'

const TableRole = () => {
  const { data, totalItems } = useSelector((state: RootState) => state.role.roles)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[0])
  console.log('data roles:', data)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: 'Name',
      width: 100,
      editable: true
    },
    {
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
      width: 110,
      editable: true,
      renderCell: params => (
        <CustomTag
          bgcolor={params.value ? 'rgba(28, 187, 140, .15)' : 'rgba(220, 53, 69, .15)'}
          color={params.value ? '#1cbb8c' : '#dc3545'}
        >
          {params.value ? 'Active' : 'Inactive'}
        </CustomTag>
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Box gap={1} display='flex'>
          <Box onClick={() => handleEdit(params.row.id)}>
            <CustomTag bgcolor='rgba(13, 110, 253, .15)' color='#0d6efd'>
              Edit
            </CustomTag>
          </Box>

          <CustomTag bgcolor='rgba(220, 53, 69, .15)' color='#dc3545'>
            Delete
          </CustomTag>

          <CustomTag bgcolor='rgba(28, 187, 140, .15)' color='#1cbb8c'>
            Create
          </CustomTag>
        </Box>
      )
    }
  ]

  const handleEdit = (id: any) => {
    console.log('ID cần Edit:', id)
  }

  return (
    <Box
      sx={{
        overflowX: 'auto'
      }}
    >
      <CustomDataGrid
        rows={data}
        getRowId={row => row.id}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
              page: page - 1
            }
          }
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
      />
    </Box>
  )
}

export default TableRole
