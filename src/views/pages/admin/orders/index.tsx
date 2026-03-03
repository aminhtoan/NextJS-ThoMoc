// ** MUI Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
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
import { NextPage } from 'next/types'

// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Components Imports
import { CustomDataGrid, CustomPagination, CustomSelect, CustomTag, IconifyIcon, SearchBar } from 'src/components'

// ** Configs Imports
import { PAGINATION_CONFIG } from 'src/configs/pagination'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { clearAdminOrderDetail } from 'src/stores/apps/admin-order'
import {
  adminFetchOrderDetailAsync,
  adminFetchOrdersAsync,
  adminFetchStatisticsAsync,
  adminUpdateOrderStatusAsync
} from 'src/stores/apps/admin-order/actions'

// ** Types Imports
import {
  AdminOrderType,
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  OrderStatusType,
  ProductSKUSnapshotType,
  VALID_STATUS_TRANSITIONS
} from 'src/types/order'

// ** Translation Import
import { useTranslation } from 'react-i18next'

// ** Hooks
import toast from 'react-hot-toast'
import useDebounce from 'src/hooks/useDebounce'
import { useAuth } from 'src/hooks/useAuth'
import { buildAbilityFor } from 'src/configs/acl'
import { METHOD_MAP } from 'src/configs/method'
import { MODULES } from 'src/configs/module'

// ==================== STATUS STEPPER CONFIG ====================
const ORDER_STEPS = [
  { key: ORDER_STATUS.PENDING_PAYMENT, label: 'Chờ thanh toán', icon: 'mdi:credit-card-clock-outline' },
  { key: ORDER_STATUS.PENDING_PICKUP, label: 'Chờ lấy hàng', icon: 'mdi:package-variant' },
  { key: ORDER_STATUS.PENDING_DELIVERY, label: 'Đang giao', icon: 'mdi:truck-delivery-outline' },
  { key: ORDER_STATUS.DELIVERED, label: 'Đã giao', icon: 'mdi:check-circle-outline' }
]

const getActiveStep = (status: string) => {
  if (status === ORDER_STATUS.CANCELLED) return -1
  if (status === ORDER_STATUS.RETURNED) return ORDER_STEPS.length
  const idx = ORDER_STEPS.findIndex(s => s.key === status)

  return idx >= 0 ? idx : 0
}

// ==================== STATISTICS CARDS ====================
const StatCard = ({ label, count, color, icon }: { label: string; count: number; color: string; icon: string }) => (
  <Card sx={{ minWidth: 140, flex: 1 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}20`
        }}
      >
        <IconifyIcon icon={icon} fontSize={24} color={color} />
      </Box>
      <Box>
        <Typography variant='h5' fontWeight={700}>
          {count}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

// ==================== HELPER ====================
const getItemName = (item: ProductSKUSnapshotType) => {
  if (item.productTranslations && item.productTranslations.length > 0 && item.productTranslations[0]?.name) {
    return item.productTranslations[0].name
  }

  return item.productName || 'Sản phẩm'
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

// ==================== ORDER DETAIL DIALOG ====================
const OrderDetailDialog = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  isUpdating,
  canUpdate
}: {
  open: boolean
  onClose: () => void
  order: AdminOrderType | null
  onUpdateStatus: (orderId: number, status: OrderStatusType) => void
  isUpdating: boolean
  canUpdate: boolean
}) => {
  const { t } = useTranslation()

  if (!order) return null

  const items = order.items || []
  const productTotal = items.reduce((sum, item) => sum + (item.skuPrice || 0) * (item.quantity || 0), 0)
  const shippingFee = order.shippingFee || 0
  const totalAmount = order.payment?.amount || productTotal + shippingFee

  const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status as OrderStatusType] || []
  const activeStep = getActiveStep(order.status as string)
  const receiver = order.receiver as any

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' fontWeight={700}>
          {t('order_details')} #{order.id}
        </Typography>
        <IconButton onClick={onClose} size='small'>
          <IconifyIcon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Status Stepper */}
        {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.RETURNED && (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {ORDER_STEPS.map(step => (
              <Step key={step.key}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {order.status === ORDER_STATUS.CANCELLED && (
          <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: '#ffeaea', borderRadius: 1 }}>
            <IconifyIcon icon='mdi:cancel' fontSize={32} color='#f44336' />
            <Typography color='error' fontWeight={600}>
              {t('order_cancelled')}
            </Typography>
          </Box>
        )}

        {order.status === ORDER_STATUS.RETURNED && (
          <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
            <IconifyIcon icon='mdi:keyboard-return' fontSize={32} color='#ff9800' />
            <Typography color='warning.main' fontWeight={600}>
              {t('order_returned')}
            </Typography>
          </Box>
        )}

        {/* Info Grid */}
        <Grid container spacing={3}>
          {/* Customer Info */}
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  <IconifyIcon icon='mdi:account' style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t('customer_info')}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {order.user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Avatar src={order.user.avatar || ''} sx={{ width: 36, height: 36 }}>
                      {order.user.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant='body2' fontWeight={600}>
                        {order.user.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {order.user.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Receiver Info */}
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  <IconifyIcon icon='mdi:map-marker' style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t('receiver_info')}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {receiver && (
                  <>
                    <Typography variant='body2'>
                      <strong>{t('Name')}:</strong> {receiver.name}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>{t('Phone')}:</strong> {receiver.phone}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>{t('Address')}:</strong> {receiver.address}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Info */}
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  <IconifyIcon icon='mdi:credit-card' style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t('payment_info')}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {order.payment && (
                  <>
                    <Typography variant='body2'>
                      <strong>{t('payment_method')}:</strong> {order.payment.paymentMethod?.name || 'N/A'}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>{t('payment_status')}:</strong>{' '}
                      <Chip
                        size='small'
                        label={order.payment.status}
                        color={
                          order.payment.status === 'SUCCESS'
                            ? 'success'
                            : order.payment.status === 'FAILED'
                              ? 'error'
                              : 'warning'
                        }
                        sx={{ borderRadius: 0.5, textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </Typography>
                    <Typography variant='body2'>
                      <strong>{t('payment_amount')}:</strong> {formatCurrency(order.payment.amount || 0)}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Delivery Info */}
          <Grid item xs={12} md={6}>
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='subtitle2' fontWeight={700} gutterBottom>
                  <IconifyIcon icon='mdi:truck' style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t('delivery_info')}
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {order.deliveryMethod && (
                  <>
                    <Typography variant='body2'>
                      <strong>{t('delivery_method')}:</strong> {order.deliveryMethod.name}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>{t('shipping_fee')}:</strong> {formatCurrency(order.deliveryMethod.price || 0)}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Items Table */}
        <Typography variant='subtitle2' fontWeight={700} sx={{ mt: 3, mb: 1 }}>
          <IconifyIcon icon='mdi:package-variant-closed' style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {t('products')} ({items.length})
        </Typography>
        <TableContainer component={Paper} variant='outlined'>
          <Table size='small'>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('products')} </TableCell>
                <TableCell align='center'>Phân loại</TableCell>
                <TableCell align='right'>Đơn giá</TableCell>
                <TableCell align='center'>SL</TableCell>
                <TableCell align='right'>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component='img'
                        src={item.image || '/images/placeholder.png'}
                        sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover' }}
                        onError={(e: any) => {
                          e.target.src = '/images/placeholder.png'
                        }}
                      />
                      <Typography variant='body2' fontWeight={500} sx={{ maxWidth: 200 }} noWrap>
                        {getItemName(item)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='caption' color='text.secondary'>
                      {item.skuValue || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>{formatCurrency(item.skuPrice || 0)}</TableCell>
                  <TableCell align='center'>{item.quantity}</TableCell>
                  <TableCell align='right'>{formatCurrency((item.skuPrice || 0) * (item.quantity || 0))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng tiền */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ minWidth: 260 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant='body2' color='text.secondary'>
                {t('product_total')}:
              </Typography>
              <Typography variant='body2'>{formatCurrency(productTotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant='body2' color='text.secondary'>
                {t('shipping_fee')}:
              </Typography>
              <Typography variant='body2'>{formatCurrency(shippingFee)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant='subtitle2' fontWeight={700}>
                {t('total_amount')}:
              </Typography>
              <Typography variant='subtitle2' fontWeight={700} color='error'>
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Update Status Section */}
        {allowedTransitions.length > 0 && canUpdate && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant='subtitle2' fontWeight={700} gutterBottom>
              {t('update_order_status')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {allowedTransitions.map(nextStatus => (
                <Button
                  key={nextStatus}
                  variant='contained'
                  size='small'
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus(order.id!, nextStatus)}
                  sx={{
                    backgroundColor: ORDER_STATUS_COLORS[nextStatus],
                    '&:hover': {
                      backgroundColor: ORDER_STATUS_COLORS[nextStatus],
                      filter: 'brightness(0.9)'
                    },
                    borderRadius: 0.5
                  }}
                >
                  {t(ORDER_STATUS_LABELS[nextStatus])}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

type TProps = {}

const OrdersPage: NextPage<TProps> = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.pageSizeOptions[1])
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [searchId, setSearchId] = useState('')

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { t } = useTranslation()
  const auth = useAuth()

  const ability = useMemo(() => {
    if (!auth.user) return null
    return buildAbilityFor(auth.user.role.name, auth.user.role.permissions)
  }, [auth])

  const canUpdate = ability?.can(METHOD_MAP.PUT, MODULES.ORDER)

  const dispatch = useDispatch<AppDispatch>()
  const { orders, isLoading, isUpdating, totalPages, totalItems, statistics, orderDetail } = useSelector(
    (state: RootState) => state.adminOrder
  )

  // Fetch orders
  const fetchOrders = useCallback(() => {
    dispatch(
      adminFetchOrdersAsync({
        page,
        limit: pageSize,
        status: filterStatus ? (filterStatus as OrderStatusType) : undefined,
        search: debouncedSearch || undefined,
        id: searchId ? Number(searchId) : undefined
      })
    )
  }, [dispatch, page, pageSize, filterStatus, debouncedSearch, searchId])

  // Fetch statistics
  const fetchStatistics = useCallback(() => {
    dispatch(adminFetchStatisticsAsync())
  }, [dispatch])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  const handleViewDetail = (orderId: number) => {
    dispatch(adminFetchOrderDetailAsync(orderId))
    setDetailDialogOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailDialogOpen(false)
    dispatch(clearAdminOrderDetail())
  }

  const handleUpdateStatus = async (orderId: number, status: OrderStatusType) => {
    try {
      await dispatch(adminUpdateOrderStatusAsync({ orderId, data: { status } })).unwrap()
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      fetchOrders()
      fetchStatistics()
    } catch (error: any) {
      toast.error(error?.message || 'Không thể cập nhật trạng thái đơn hàng')
    }
  }

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newSize: number) => {
    setPage(1)
    setPageSize(newSize)
  }

  const handleResetSearch = () => {
    setSearchTerm('')
  }

  const handleClearFilter = () => {
    setFilterStatus('')
    setSearchTerm('')
    setSearchId('')
  }

  // ==================== TABLE COLUMNS ====================
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã đơn',
      width: 90,
      renderCell: params => (
        <Typography variant='body2' fontWeight={600}>
          #{params.value}
        </Typography>
      )
    },
    {
      field: 'user',
      headerName: t('Khách hàng'),
      width: 200,
      renderCell: params => {
        const user = params.value
        if (!user) return 'N/A'

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={user.avatar || ''} sx={{ width: 32, height: 32 }}>
              {user.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant='body2' fontWeight={500} noWrap>
                {user.name}
              </Typography>
              <Typography variant='caption' color='text.secondary' noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'items',
      headerName: t('Sản phẩm'),
      width: 100,
      renderCell: params => {
        const items = params.value || []

        return <Typography variant='body2'>{items.length} SP</Typography>
      }
    },
    {
      field: 'payment',
      headerName: t('Tổng tiền'),
      width: 150,
      renderCell: params => {
        const payment = params.value
        const amount = payment?.amount || 0

        return (
          <Typography variant='body2' fontWeight={600} color='error.main'>
            {formatCurrency(amount)}
          </Typography>
        )
      }
    },
    {
      field: 'paymentStatus',
      headerName: t('Thanh toán'),
      width: 130,
      renderCell: params => {
        const payment = params.row.payment
        if (!payment) return '-'
        const status = payment.status
        const method = payment.paymentMethod?.name || ''

        let color = '#ff9800'
        let bgcolor = 'rgba(255, 152, 0, 0.15)'
        if (status === 'SUCCESS') {
          color = '#4caf50'
          bgcolor = 'rgba(76, 175, 80, 0.15)'
        } else if (status === 'FAILED') {
          color = '#f44336'
          bgcolor = 'rgba(244, 67, 54, 0.15)'
        }

        return (
          <Tooltip title={`${method} - ${status}`}>
            <Box>
              <CustomTag bgcolor={bgcolor} color={color}>
                {status}
              </CustomTag>
            </Box>
          </Tooltip>
        )
      }
    },
    {
      field: 'status',
      headerName: t('Trạng thái'),
      width: 170,
      renderCell: params => {
        const status = params.value as OrderStatusType

        return (
          <Chip
            size='small'
            label={t(ORDER_STATUS_LABELS[status]) || status}
            sx={{
              backgroundColor: ORDER_STATUS_COLORS[status] || '#888',
              color: '#fff',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: 0.5
            }}
          />
        )
      }
    },
    {
      field: 'createdAt',
      headerName: t('Ngày tạo'),
      width: 160,
      renderCell: params => (
        <Typography variant='body2'>
          {new Date(params.value).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: t('Thao tác'),
      width: 120,
      sortable: false,
      renderCell: params => {
        const allowedTransitions = VALID_STATUS_TRANSITIONS[params.row.status as OrderStatusType] || []

        return (
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {/* Xem chi tiết */}
            <Tooltip title='Xem chi tiết'>
              <IconButton size='small' onClick={() => handleViewDetail(params.row.id)} color='primary'>
                <IconifyIcon icon='mdi:eye-outline' />
              </IconButton>
            </Tooltip>

            {/* Cập nhật trạng thái */}
            {allowedTransitions.length > 0 && (
              <Tooltip title='Cập nhật trạng thái'>
                <IconButton
                  size='small'
                  color='warning'
                  disabled={!canUpdate}
                  onClick={() => {
                    canUpdate && handleViewDetail(params.row.id) // mở dialog rồi cập nhật trong đó
                  }}
                >
                  <IconifyIcon icon='mdi:pencil-outline' />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  // ==================== STATUS FILTER OPTIONS ====================
  const statusOptions = Object.values(ORDER_STATUS).map(status => ({
    id: status,
    name: t(ORDER_STATUS_LABELS[status]) || status
  }))

  // ==================== STATISTICS ====================
  const statsConfig = [
    { key: 'total', label: 'Tổng đơn', color: '#1677ff', icon: 'mdi:shopping-outline', count: statistics?.total || 0 },
    {
      key: 'PENDING_PAYMENT',
      label: t('PENDING_PAYMENT'),
      color: '#ff9800',
      icon: 'mdi:credit-card-clock-outline',
      count: statistics?.byStatus?.PENDING_PAYMENT || 0
    },
    {
      key: 'PENDING_PICKUP',
      label: t('PENDING_PICKUP'),
      color: '#2196f3',
      icon: 'mdi:package-variant',
      count: statistics?.byStatus?.PENDING_PICKUP || 0
    },
    {
      key: 'PENDING_DELIVERY',
      label: t('PENDING_DELIVERY'),
      color: '#1677ff',
      icon: 'mdi:truck-delivery-outline',
      count: statistics?.byStatus?.PENDING_DELIVERY || 0
    },
    {
      key: 'DELIVERED',
      label: t('DELIVERED'),
      color: '#4caf50',
      icon: 'mdi:check-circle-outline',
      count: statistics?.byStatus?.DELIVERED || 0
    },
    {
      key: 'CANCELLED',
      label: t('CANCELLED'),
      color: '#9e9e9e',
      icon: 'mdi:cancel',
      count: statistics?.byStatus?.CANCELLED || 0
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {statsConfig.map(stat => (
          <StatCard key={stat.key} label={stat.label} count={stat.count} color={stat.color} icon={stat.icon} />
        ))}
      </Box>

      {/* Data Table */}
      <Paper>
        {/* Filters */}
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <CustomSelect
              placeholder={t('Lọc theo trạng thái')}
              options={statusOptions}
              value={filterStatus}
              onChange={value => {
                setFilterStatus(value as string)
                setPage(1)
              }}
            />
          </Grid>

          {/* ✅ Thêm input tìm theo ID */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                px: 1.5,
                height: 40,
                gap: 1,
                backgroundColor: '#fff'
              }}
            >
              <IconifyIcon icon='mdi:pound' color='#888' fontSize={18} />
              <input
                type='number'
                placeholder='Tìm theo mã đơn...'
                value={searchId}
                onChange={e => {
                  setSearchId(e.target.value)
                  setPage(1)
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  backgroundColor: 'transparent'
                }}
              />
              {searchId && (
                <IconButton size='small' onClick={() => setSearchId('')}>
                  <IconifyIcon icon='mdi:close' fontSize={16} />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, px: 3, pb: 2 }}>
          <Box>
            <Button onClick={handleClearFilter} sx={{ height: '100%' }}>
              <IconifyIcon icon='mdi:refresh' />
            </Button>
          </Box>
          <Box>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onReset={handleResetSearch} />
          </Box>
        </Box>

        <Divider />

        <CustomDataGrid
          rows={orders}
          columns={columns}
          getRowId={row => row.id}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          loading={isLoading}
          rowHeight={64}
          slots={{
            pagination: () => (
              <CustomPagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                totalPages={totalPages}
                pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            )
          }}
        />
      </Paper>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetail}
        order={orderDetail}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
        canUpdate={!!canUpdate}
      />
    </Box>
  )
}

export default OrdersPage
