// ** MUI Imports
import { Box, Button, Chip, Divider, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Next Imports
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'

// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** Components Imports
import { CustomDataGrid, CustomPagination, CustomSelect, CustomTag, IconifyIcon, SearchBar } from 'src/components'

// ** Configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'
import { ADMIN_ROUTES } from 'src/configs/route'

// ** Services
import { GetBrand } from 'src/service/brand'
import { GetCategory } from 'src/service/category'
import { deleteProduct, getProducts } from 'src/service/manage-product'

// ** Hooks
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import useDebounce from 'src/hooks/useDebounce'

// ** Toast
import toast from 'react-hot-toast'

// ** Components
import { BrandType } from 'src/types/brand'
import { CategoryType } from 'src/types/category'
import { GetManagerProductsQueryType, ProductType, VariantsType } from 'src/types/product'
import DeleteProductDialog from './components/DeleteProductDialog'

type ProductRow = {
  id: number
  name: string
  image: string
  basePrice: number
  virtualPrice: number
  brandId: number
  publishedAt: string | null
  createdAt: string
  variants: VariantsType
}

const ProductsPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [filterBrand, setFilterBrand] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'sale'>('createdAt')
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')
  const [brandOptions, setBrandOptions] = useState<Array<{ id: string; name: string }>>([])
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string }>>([])

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()

  const columns: GridColDef<ProductRow>[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 60,
      sortable: false
    },
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      maxWidth: 250,
      sortable: false,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {params.row.image ? (
              <img
                src={params.row.image}
                alt={params.row.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <IconifyIcon icon='tabler:photo' />
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0
            }}
          >
            <Typography
              variant='body2'
              fontWeight={500}
              noWrap
              title={params.value}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.value}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'basePrice',
      headerName: t('Price'),
      width: 140,
      sortable: false,
      renderCell: params => (
        <Typography variant='body2'>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value)}
        </Typography>
      )
    },
    {
      field: 'virtualPrice',
      headerName: t('Virtual price'),
      width: 140,
      sortable: false,
      renderCell: params => (
        <Typography variant='body2' color='text.secondary' sx={{ textDecoration: 'line-through' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value)}
        </Typography>
      )
    },
    {
      field: 'variants',
      headerName: t('Variants'),
      width: 130,
      sortable: false,
      renderCell: params => {
        const count = params.value?.length || 0

        return <Chip label={`${count} ${t('options')}`} size='small' variant='outlined' />
      }
    },
    {
      field: 'publishedAt',
      headerName: t('Status'),
      width: 130,
      sortable: false,
      renderCell: params => {
        const publishedAt = params.value
        const now = new Date()
        let bgColor: string
        let color: string
        let label: string

        if (!publishedAt) {
          bgColor = 'rgba(255, 193, 7, .15)'
          color = '#ffc107'
          label = t('Draft')
        } else {
          const publishDate = new Date(publishedAt)
          if (publishDate <= now) {
            bgColor = 'rgba(28, 187, 140, .15)'
            color = '#1cbb8c'
            label = t('Published')
          } else {
            bgColor = 'rgba(2, 136, 209, .15)' // Màu xanh dương nhạt
            color = '#0288d1'
            label = t('Pending')
          }
        }

        return (
          <CustomTag bgcolor={bgColor} color={color}>
            {label}
          </CustomTag>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: t('Created'),
      width: 110,
      sortable: false,
      renderCell: params => (
        <Typography variant='body2' color='text.secondary'>
          {new Date(params.value).toLocaleDateString('vi-VN')}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      width: 130,
      sortable: false,
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('Edit')}>
            <IconButton size='small' onClick={() => handleEdit(params.row.id)}>
              <IconifyIcon icon='tabler:pencil' />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('Delete')}>
            <IconButton
              size='small'
              onClick={() => handleOpenDelete(params.row.id, params.row.name)}
              sx={{ color: 'error.main' }}
            >
              <IconifyIcon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const query: GetManagerProductsQueryType = {
        page,
        limit: pageSize,
        name: debouncedSearch || undefined,
        brandIds: filterBrand.length > 0 ? filterBrand.map(Number) : undefined,
        categories: filterCategory.length > 0 ? filterCategory.map(Number) : undefined,
        orderBy: orderBy,
        sortBy: sortBy,
        createdById: user.id
      }

      const response = await getProducts(query)
      const data = response.data

      const rows: ProductRow[] = (data.data || []).map((product: ProductType) => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        basePrice: product.basePrice,
        virtualPrice: product.virtualPrice,
        brandId: product.brandId,
        publishedAt: product.publishedAt,
        createdAt: product.createdAt,
        variants: product.variants || []
      }))

      setProducts(rows)
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(t('Failed to load products'))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, filterBrand, filterCategory, sortBy, orderBy, user?.id, t])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch brand options
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await GetBrand({ page: 1, limit: 100, search: '' })
        const brands = response.data?.data || []
        setBrandOptions(brands.map((b: BrandType) => ({ id: String(b.id), name: b.name })))
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }
    fetchBrands()
  }, [])

  // Fetch category options
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetCategory({})
        const categories = response.data?.data || []
        setCategoryOptions(categories.map((c: CategoryType) => ({ id: String(c.id), name: c.name })))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleEdit = (id: number) => {
    router.push(`${ADMIN_ROUTES.PRODUCTS}/${id}`)
  }

  const handleOpenDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name })
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget.id)
      toast.success(t('Deleted successfully'))
      setDeleteOpen(false)
      setDeleteTarget(null)
      fetchProducts()
    } catch (error) {
      toast.error(t('Failed to delete'))
    }
  }

  const handleClearFilters = () => {
    setFilterBrand([])
    setFilterCategory([])
    setSortBy('createdAt')
    setOrderBy('desc')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5' fontWeight={600}>
          {t('Products')}
        </Typography>
        <Button
          variant='contained'
          startIcon={<IconifyIcon icon='tabler:plus' />}
          onClick={() => router.push(ADMIN_ROUTES.PRODUCTS_ADD)}
        >
          {t('Add product')}
        </Button>
      </Box>

      {/* Main Content */}
      <Paper>
        {/* Filters */}
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <CustomSelect
              placeholder={t('Filter by brand')}
              options={brandOptions}
              value={filterBrand}
              onChange={value => setFilterBrand(value as string[])}
              multiple
            />
            {filterBrand.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                {filterBrand.map(brandId => {
                  const brand = brandOptions.find(b => b.id === brandId)

                  return (
                    <Chip
                      key={brandId}
                      label={brand?.name || brandId}
                      size='small'
                      onDelete={() => setFilterBrand(prev => prev.filter(id => id !== brandId))}
                      color='primary'
                      variant='outlined'
                    />
                  )
                })}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomSelect
              placeholder={t('Filter by category')}
              options={categoryOptions}
              value={filterCategory}
              onChange={value => setFilterCategory(value as string[])}
              multiple
            />
            {filterCategory.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                {filterCategory.map(categoryId => {
                  const category = categoryOptions.find(c => c.id === categoryId)

                  return (
                    <Chip
                      key={categoryId}
                      label={category?.name || categoryId}
                      size='small'
                      onDelete={() => setFilterCategory(prev => prev.filter(id => id !== categoryId))}
                      color='secondary'
                      variant='outlined'
                    />
                  )
                })}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomSelect
              placeholder={t('Sort by')}
              options={[
                { id: 'createdAt', name: t('Created date') },
                { id: 'price', name: t('Price') },
                { id: 'sale', name: t('Sales') }
              ]}
              value={sortBy}
              onChange={value => setSortBy(value as 'createdAt' | 'price' | 'sale')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomSelect
              placeholder={t('Order')}
              options={[
                { id: 'desc', name: t('Newest first') },
                { id: 'asc', name: t('Oldest first') }
              ]}
              value={orderBy}
              onChange={value => setOrderBy(value as 'asc' | 'desc')}
            />
          </Grid>
        </Grid>

        {/* Search & Actions bar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2 }}>
          <Button onClick={handleClearFilters}>
            <IconifyIcon icon='mdi:refresh' />
          </Button>
          <SearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onReset={() => setSearchTerm('')}
          />
        </Box>

        <Divider />

        {/* Data Grid */}
        <CustomDataGrid
          rows={products}
          columns={columns}
          getRowId={row => row.id}
          checkboxSelection={false}
          disableRowSelectionOnClick={false}
          disableColumnMenu
          autoHeight
          loading={loading}
          slots={{
            pagination: () => (
              <CustomPagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                totalPages={totalPages}
                pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
                onPageChange={newPage => setPage(newPage)}
                onPageSizeChange={newSize => {
                  setPage(1)
                  setPageSize(newSize)
                }}
              />
            )
          }}
        />
      </Paper>

      {/* Delete Dialog */}
      <DeleteProductDialog
        open={deleteOpen}
        productName={deleteTarget?.name || ''}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}

export default ProductsPage
