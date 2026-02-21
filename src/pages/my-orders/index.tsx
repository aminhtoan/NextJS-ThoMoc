import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { Box, Button, Chip, CircularProgress, Pagination, Paper, Tab, Tabs, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch, RootState } from 'src/stores'
import { cancelOrderAsync, fetchOrdersAsync } from 'src/stores/apps/order/actions'
import {
    ORDER_STATUS,
    ORDER_STATUS_COLORS,
    ORDER_STATUS_LABELS,
    OrderStatusType,
    ProductSKUSnapshotType
} from 'src/types/order'

const PRIMARY_COLOR = '#1677ff'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='14' fill='%23aaa'%3ENo Image%3C/text%3E%3C/svg%3E"

const ORDER_TABS = [
  { label: 'Tất cả', value: undefined },
  { label: ORDER_STATUS_LABELS.PENDING_PAYMENT, value: ORDER_STATUS.PENDING_PAYMENT },
  { label: ORDER_STATUS_LABELS.PENDING_PICKUP, value: ORDER_STATUS.PENDING_PICKUP },
  { label: ORDER_STATUS_LABELS.PENDING_DELIVERY, value: ORDER_STATUS.PENDING_DELIVERY },
  { label: ORDER_STATUS_LABELS.DELIVERED, value: ORDER_STATUS.DELIVERED },
  { label: ORDER_STATUS_LABELS.CANCELLED, value: ORDER_STATUS.CANCELLED }
]

export default function MyOrdersPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { orders, isLoading, totalPages, page: currentPage } = useSelector((state: RootState) => state.order)

  const [activeTab, setActiveTab] = useState(0)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  const currentStatus = ORDER_TABS[activeTab]?.value as OrderStatusType | undefined

  const fetchOrders = useCallback(
    (page = 1) => {
      dispatch(fetchOrdersAsync({ page, limit: 10, status: currentStatus }))
    },
    [dispatch, currentStatus]
  )

  useEffect(() => {
    if (user) {
      fetchOrders(1)
    }
  }, [fetchOrders, user])

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue)
  }

  const handlePageChange = (_: any, page: number) => {
    fetchOrders(page)
  }

  const handleCancelOrder = async (orderId: number) => {
    setCancellingId(orderId)
    try {
      await dispatch(cancelOrderAsync(orderId)).unwrap()
      toast.success('Đã hủy đơn hàng')
      fetchOrders(currentPage)
    } catch (error: any) {
      toast.error(error?.message || 'Không thể hủy đơn hàng')
    } finally {
      setCancellingId(null)
    }
  }

  const getItemName = (item: ProductSKUSnapshotType) => {
    if (item.productTranslations && item.productTranslations.length > 0 && item.productTranslations[0]?.name) {
      return item.productTranslations[0].name
    }

    return item.productName || 'Sản phẩm'
  }

  const canCancel = (status: string) => {
    return [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.PENDING_PICKUP].includes(status as any)
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Vui lòng đăng nhập để xem đơn hàng
        </Typography>
        <Button variant='contained' onClick={() => router.push('/login')}>
          Đăng nhập
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>Đơn hàng của tôi - Thổ mộc</title>
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Tabs */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              '& .MuiTab-root': { fontSize: '14px', fontWeight: 500, textTransform: 'none', minWidth: 120 },
              '& .Mui-selected': { color: `${PRIMARY_COLOR} !important` },
              '& .MuiTabs-indicator': { backgroundColor: PRIMARY_COLOR }
            }}
          >
            {ORDER_TABS.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Orders */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#999', fontSize: '16px' }}>Chưa có đơn hàng nào</Typography>
          </Paper>
        ) : (
          <>
            {orders.map(order => {
              const items = order.items || []
              const orderTotal = items.reduce((sum, item) => sum + (item.skuPrice || 0) * (item.quantity || 0), 0)

              return (
                <Paper key={order.id} sx={{ mb: 2, overflow: 'hidden' }}>
                  {/* Order header */}
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', color: '#888' }}>
                      Đơn hàng #{order.id} -{' '}
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                    <Chip
                      label={ORDER_STATUS_LABELS[order.status as OrderStatusType] || order.status}
                      size='small'
                      sx={{
                        backgroundColor: ORDER_STATUS_COLORS[order.status as OrderStatusType] || '#888',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}
                    />
                  </Box>

                  {/* Items */}
                  {items.map((item, index) => (
                    <Box
                      key={item.id || index}
                      sx={{
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: index < items.length - 1 ? '1px solid #f5f5f5' : 'none',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#fafafa' }
                      }}
                      onClick={() => router.push(`/my-orders/${order.id}`)}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          position: 'relative',
                          flexShrink: 0,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '1px solid #f0f0f0'
                        }}
                      >
                        <Image
                          src={item.image || PLACEHOLDER_IMAGE}
                          alt={getItemName(item)}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {getItemName(item)}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#888' }}>
                          Phân loại: {item.skuValue || 'Mặc định'}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#888' }}>x{item.quantity}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: PRIMARY_COLOR, fontWeight: 500 }}>
                        {((item.skuPrice || 0) * (item.quantity || 0)).toLocaleString()}đ
                      </Typography>
                    </Box>
                  ))}

                  {/* Order footer */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f0f0f0'
                    }}
                  >
                    <Box>
                      {canCancel(order.status as string) && (
                        <Button
                          size='small'
                          variant='outlined'
                          color='error'
                          startIcon={
                            cancellingId === order.id ? <CircularProgress size={16} /> : <CancelOutlinedIcon />
                          }
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          sx={{ fontSize: '12px' }}
                        >
                          Hủy đơn
                        </Button>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '13px', color: '#888' }}>
                        Tổng số tiền ({items.reduce((sum, i) => sum + (i.quantity || 0), 0)} sản phẩm):
                      </Typography>
                      <Typography sx={{ fontSize: '20px', fontWeight: 600, color: PRIMARY_COLOR }}>
                        {orderTotal.toLocaleString()}đ
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color='primary'
                  shape='rounded'
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  )
}

MyOrdersPage.guestGuard = false
MyOrdersPage.authGuard = true
