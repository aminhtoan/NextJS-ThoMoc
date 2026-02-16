// ** MUI Imports
import { Box, IconButton, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef'

// ** React Imports
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

// ** Components Imports
import { CustomDataGrid, CustomPagination, CustomTag, IconifyIcon, SearchBar } from 'src/components'

// ** configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Service Import
import { getDeliveryMethods, restoreDeliveryMethod, toggleDeliveryMethodStatus } from 'src/service/delivery-methods'
import { CreateDeliveryMethod, DeleteDeliveryMethod, UpdateDeliveryMethod } from './components/DeliveryMethod'

const PageDeliveryMethods = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [loading, setLoading] = React.useState(false)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalItems, setTotalItems] = React.useState(0)
  const [data, setData] = React.useState([])
  const [isOpenCreate, setIsOpenCreate] = React.useState(false)
  const [isOpenUpdate, setIsOpenUpdate] = React.useState(false)
  const [isOpenDelete, setIsOpenDelete] = React.useState(false)
  const [updateData, setUpdateData] = React.useState<any>(null)
  const [selectedIds, setSelectedIds] = React.useState<number>(0)
  const [deleteData, setDeleteData] = React.useState({
    id: 0,
    name: ''
  })
  const { t } = useTranslation()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'name',
      headerName: t('Name'),
      width: 180
    },
    {
      field: 'code',
      headerName: t('Code'),
      width: 180
    },
    {
      field: 'price',
      headerName: t('Price'),
      width: 100,
      renderCell: params => {
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(params.value)

        return `${formattedPrice} đ`
      }
    },
    {
      field: 'description',
      headerName: t('Description'),
      width: 200
    },
    {
      field: 'isActive',
      headerName: t('Active'),
      type: 'boolean',
      width: 150,
      renderCell: params => (
        <Box onClick={() => handleToggleStatus(params.row.id)} sx={{ cursor: 'pointer' }}>
          <CustomTag
            bgcolor={params.value ? 'rgba(28, 187, 140, .15)' : 'rgba(220, 53, 69, .15)'}
            color={params.value ? '#1cbb8c' : '#dc3545'}
          >
            {params.value ? t('Active') : t('Inactive')}
          </CustomTag>
        </Box>
      )
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: params => {
        const isDeleted = !!params.row.deletedAt

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size='small' disabled={isDeleted} onClick={() => handleOpenUpdate(params.row)}>
              <IconifyIcon icon='tabler:pencil' />
            </IconButton>

            <IconButton
              size='small'
              disabled={isDeleted}
              onClick={() => handleOpenDelete(params.row.id, params.row.name)}
            >
              <IconifyIcon icon='tabler:trash' />
            </IconButton>

            {isDeleted && (
              <IconButton size='small' color='primary' onClick={() => handleRestore(params.row.id)}>
                <IconifyIcon icon='tabler:refresh' />
              </IconButton>
            )}
          </Box>
        )
      }
    }
  ]

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newSize: number) => {
    setPageSize(newSize)
  }

  const handleOpenUpdate = (row: any) => {
    setSelectedIds(row.id)
    setUpdateData(row)
    setIsOpenUpdate(true)
  }

  const handleOpenDelete = (id: number, name: string) => {
    setDeleteData({ id, name })
    setIsOpenDelete(true)
  }

  const handleOpenCreate = () => {
    setIsOpenCreate(true)
  }

  const handleResetSearch = () => {
    setSearchTerm('')
  }

  const handleRestore = async (id: number) => {
    try {
      await restoreDeliveryMethod(id)
      handleRefreshTable()
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleDeliveryMethodStatus(id)
      handleRefreshTable()
    } catch (error) {
      console.error(error)
    }
  }

  const handleRefreshTable = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getDeliveryMethods(page, pageSize)
      setTotalItems(res.data.totalItems)
      setTotalPages(res.data.totalPages)
      setData(res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [pageSize, page])

  React.useEffect(() => {
    handleRefreshTable()
  }, [handleRefreshTable])

  return (
    <Box sx={{ p: 3 }}>
      {/* làm thêm nút tạo mới payment method ở đây */}
      <Paper elevation={2} sx={{ p: 2, gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2 }}>
          <Box>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onReset={handleResetSearch} />
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
              {t('Add Delivery Method')}
            </Box>
          </Box>
        </Box>
        <Box>
          <CustomDataGrid
            loading={loading}
            rows={data}
            getRowId={row => row.id}
            columns={columns}
            checkboxSelection
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
        </Box>
      </Paper>
      <DeleteDeliveryMethod
        open={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        data={deleteData}
        onDeleted={handleRefreshTable}
      />
      <CreateDeliveryMethod open={isOpenCreate} onClose={() => setIsOpenCreate(false)} onCreated={handleRefreshTable} />

      <UpdateDeliveryMethod
        open={isOpenUpdate}
        onClose={() => setIsOpenUpdate(false)}
        onUpdated={handleRefreshTable}
        data={updateData}
        rowId={selectedIds}
      />
    </Box>
  )
}

export default PageDeliveryMethods
