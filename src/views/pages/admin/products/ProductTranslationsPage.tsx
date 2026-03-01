// ** MUI Imports
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

// ** Next Imports
import { useRouter } from 'next/router'
import { NextPage } from 'next/types'

// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** Components Imports
import { CustomDataGrid, CustomPagination, IconifyIcon, SearchBar } from 'src/components'

// ** Configs
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Services
import { GetLanguage } from 'src/service/language'
import { getProducts } from 'src/service/manage-product'
import { deleteProductTranslation, getProductTranslationsByProductId } from 'src/service/translation-product'

// ** Hooks
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import useDebounce from 'src/hooks/useDebounce'

// ** Toast
import toast from 'react-hot-toast'

// ** Types
import { LanguageType } from 'src/types/language'
import { ProductTranslationType } from 'src/types/product-translation'
import { GetManagerProductsQueryType, ProductType } from 'src/types/product'

// ** Components
import DeleteTranslationDialog from './components/DeleteTranslationDialog'
import TranslationFormDialog from './components/TranslationFormDialog'

interface TranslationPanelProps {
  productId: number
  productName: string
  languageMap: Record<string, string>
  expanded: boolean
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({ productId, productName, languageMap, expanded }) => {
  const { t } = useTranslation()
  const [translations, setTranslations] = useState<ProductTranslationType[]>([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const fetchTranslations = useCallback(async () => {
    if (!expanded) return
    try {
      setLoading(true)
      const response = await getProductTranslationsByProductId(productId)
      setTranslations(response.data?.data || [])
    } catch (error) {
      console.error('Error fetching translations:', error)
    } finally {
      setLoading(false)
    }
  }, [productId, expanded])

  useEffect(() => {
    fetchTranslations()
  }, [fetchTranslations])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteProductTranslation(deleteTarget.id)
      toast.success(t('Deleted successfully'))
      setDeleteOpen(false)
      setDeleteTarget(null)
      fetchTranslations()
    } catch {
      toast.error(t('Failed to delete'))
    }
  }

  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <Box sx={{ px: 4, py: 2, bgcolor: 'action.hover' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='subtitle2' fontWeight={600}>
            {t('Translations for')}: {productName}
          </Typography>
          <Button
            size='small'
            variant='contained'
            startIcon={<IconifyIcon icon='tabler:plus' />}
            onClick={() => {
              setEditId(null)
              setFormOpen(true)
            }}
          >
            {t('Add Translation')}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : translations.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              {t('No translations yet. Click "Add Translation" to create one.')}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant='outlined' sx={{ mb: 1 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>ID</TableCell>
                  <TableCell width={140}>{t('Language')}</TableCell>
                  <TableCell>{t('Translated Name')}</TableCell>
                  <TableCell>{t('Description')}</TableCell>
                  <TableCell width={120}>{t('Created')}</TableCell>
                  <TableCell width={100} align='center'>
                    {t('Actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {translations.map(item => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={languageMap[item.languageId] || item.languageId}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight={500} noWrap sx={{ maxWidth: 250 }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary' noWrap sx={{ maxWidth: 300 }}>
                        {item.description?.replace(/<[^>]*>/g, '') || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title={t('Edit')}>
                          <IconButton
                            size='small'
                            onClick={() => {
                              setEditId(item.id)
                              setFormOpen(true)
                            }}
                          >
                            <IconifyIcon icon='tabler:pencil' fontSize={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')}>
                          <IconButton
                            size='small'
                            sx={{ color: 'error.main' }}
                            onClick={() => {
                              setDeleteTarget({ id: item.id, name: item.name })
                              setDeleteOpen(true)
                            }}
                          >
                            <IconifyIcon icon='tabler:trash' fontSize={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Form Dialog */}
        <TranslationFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditId(null)
          }}
          onSuccess={fetchTranslations}
          productId={productId}
          productName={productName}
          translationId={editId}
        />

        {/* Delete Dialog */}
        <DeleteTranslationDialog
          open={deleteOpen}
          translationName={deleteTarget?.name || ''}
          onClose={() => {
            setDeleteOpen(false)
            setDeleteTarget(null)
          }}
          onConfirm={handleDeleteConfirm}
        />
      </Box>
    </Collapse>
  )
}

// ==============================
// Main Page
// ==============================
type ProductRow = {
  id: number
  name: string
  image: string
  basePrice: number
  createdAt: string
}

const ProductTranslationsPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)
  const [languageMap, setLanguageMap] = useState<Record<string, string>>({})

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()

  // Auto-expand if productId is passed in query
  useEffect(() => {
    const { productId } = router.query
    if (productId) {
      const id = Number(productId)
      if (!isNaN(id) && id > 0) {
        setExpandedProductId(id)
      }
    }
  }, [router.query])

  // Product columns
  const columns: GridColDef<ProductRow>[] = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: params => {
        const isExpanded = expandedProductId === params.row.id

        return (
          <IconButton size='small' onClick={() => handleToggleExpand(params.row.id)}>
            <IconifyIcon icon={isExpanded ? 'tabler:chevron-up' : 'tabler:chevron-down'} />
          </IconButton>
        )
      }
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      sortable: false
    },
    {
      field: 'name',
      headerName: t('Product Name'),
      flex: 1,
      minWidth: 250,
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
          <Typography
            variant='body2'
            fontWeight={500}
            noWrap
            title={params.value}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
          >
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'basePrice',
      headerName: t('Price'),
      width: 150,
      sortable: false,
      renderCell: params => (
        <Typography variant='body2'>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value)}
        </Typography>
      )
    },
    {
      field: 'createdAt',
      headerName: t('Created'),
      width: 120,
      sortable: false,
      renderCell: params => (
        <Typography variant='body2' color='text.secondary'>
          {new Date(params.value).toLocaleDateString('vi-VN')}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: t('Translations'),
      width: 160,
      sortable: false,
      renderCell: params => {
        const isExpanded = expandedProductId === params.row.id

        return (
          <Button
            size='small'
            variant={isExpanded ? 'contained' : 'outlined'}
            startIcon={<IconifyIcon icon='ic:baseline-translate' />}
            onClick={() => handleToggleExpand(params.row.id)}
          >
            {isExpanded ? t('Hide') : t('Manage')}
          </Button>
        )
      }
    }
  ]

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const query: GetManagerProductsQueryType = {
        page,
        limit: pageSize,
        name: debouncedSearch || undefined,
        orderBy: 'desc',
        sortBy: 'createdAt',
        createdById: user.id
      }
      const response = await getProducts(query)
      const data = response.data
      const rows: ProductRow[] = (data.data || []).map((product: ProductType) => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        basePrice: product.basePrice,
        createdAt: product.createdAt
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
  }, [page, pageSize, debouncedSearch, user?.id, t])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await GetLanguage()
        const languages = response.data?.data || []
        const map: Record<string, string> = {}
        languages.forEach((lang: LanguageType) => {
          map[lang.id] = lang.name
        })
        setLanguageMap(map)
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const handleToggleExpand = (productId: number) => {
    setExpandedProductId(prev => (prev === productId ? null : productId))
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h5' fontWeight={600}>
            {t('Product Translations')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('Manage multilingual translations for your products')}
          </Typography>
        </Box>
      </Box>

      {/* Products Table */}
      <Paper>
        {/* Search */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3 }}>
          <SearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onReset={() => setSearchTerm('')}
          />
        </Box>

        <Divider />

        {/* Data Grid + expandable translation panels */}
        <CustomDataGrid
          rows={products}
          columns={columns}
          getRowId={row => row.id}
          checkboxSelection={false}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          loading={loading}
          getRowClassName={params => (expandedProductId === params.row.id ? 'expanded-row' : '')}
          sx={{
            '& .expanded-row': {
              bgcolor: 'action.selected'
            }
          }}
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

        {/* Expandable Translation Panels (rendered below the grid for each product) */}
        {products.map(product => (
          <TranslationPanel
            key={product.id}
            productId={product.id}
            productName={product.name}
            languageMap={languageMap}
            expanded={expandedProductId === product.id}
          />
        ))}
      </Paper>
    </Box>
  )
}

export default ProductTranslationsPage
