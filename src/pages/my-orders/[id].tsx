import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PaymentQRDialog from 'src/components/PaymentQRDialog'
import { PLACEHOLDER_IMAGE } from 'src/configs/place_holder'
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch, RootState } from 'src/stores'
import { clearOrderDetail } from 'src/stores/apps/order'
import { cancelOrderAsync, fetchOrderDetailAsync } from 'src/stores/apps/order/actions'
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  OrderStatusType,
  ProductSKUSnapshotType
} from 'src/types/order'

const PRIMARY_COLOR = '#1677ff'

// Order progress steps
const ORDER_STEPS = [
  { label: 'transaction_processing', status: ORDER_STATUS.PENDING_PAYMENT },
  { label: 'pending_pickup', status: ORDER_STATUS.PENDING_PICKUP },
  { label: 'out_for_delivery', status: ORDER_STATUS.PENDING_DELIVERY },
  { label: 'delivered', status: ORDER_STATUS.DELIVERED }
]

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'pending_payment',
  SUCCESS: 'paid',
  FAILED: 'payment_failed'
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff9800',
  SUCCESS: '#4caf50',
  FAILED: '#f44336'
}

export default function OrderDetailPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { orderDetail, isLoading } = useSelector((state: RootState) => state.order)
  const { id } = router.query
  const { t } = useTranslation()
  const [cancellingOrder, setCancellingOrder] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  useEffect(() => {
    if (id && user) {
      dispatch(fetchOrderDetailAsync(Number(id)))
    }

    return () => {
      dispatch(clearOrderDetail())
    }
  }, [id, user, dispatch])

  // Auto-open PaymentQRDialog when redirected from checkout with ?pay=true
  useEffect(() => {
    if (router.query.pay === 'true' && orderDetail?.status === ORDER_STATUS.PENDING_PAYMENT) {
      setPaymentDialogOpen(true)

      // Remove ?pay query param immediately to prevent re-open
      router.replace(`/my-orders/${id}`, undefined, { shallow: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.pay, orderDetail?.status, id])

  // Auto-close dialog when payment is no longer pending
  useEffect(() => {
    if (orderDetail?.status && orderDetail.status !== ORDER_STATUS.PENDING_PAYMENT && paymentDialogOpen) {
      setPaymentDialogOpen(false)
    }
  }, [orderDetail?.status, paymentDialogOpen])

  const getActiveStep = (status: string) => {
    if (status === ORDER_STATUS.CANCELLED || status === ORDER_STATUS.RETURNED) return -1
    const index = ORDER_STEPS.findIndex(step => step.status === status)

    return index >= 0 ? index : 0
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

  const handleCancelOrder = async () => {
    if (!orderDetail?.id) return
    setCancellingOrder(true)
    try {
      await dispatch(cancelOrderAsync(orderDetail.id)).unwrap()
      toast.success(t('order_cancelled_successfully'))
      dispatch(fetchOrderDetailAsync(orderDetail.id))
    } catch (error: any) {
      toast.error(error?.message || t('cannot_cancel_order'))
    } finally {
      setCancellingOrder(false)
    }
  }

  if (isLoading || !orderDetail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  const items = orderDetail.items || []
  const receiver = orderDetail.receiver
  const payment = orderDetail.payment
  const deliveryMethod = orderDetail.deliveryMethod as
    | { id: number; name: string; code: string; price: number; description?: string | null }
    | undefined
  const shippingFee = (orderDetail as any).shippingFee || deliveryMethod?.price || 0
  const productTotal = items.reduce((sum, item) => sum + (item.skuPrice || 0) * (item.quantity || 0), 0)
  const grandTotal = productTotal + shippingFee
  const orderStatus = orderDetail.status as OrderStatusType
  const activeStep = getActiveStep(orderStatus)
  const isCancelledOrReturned = orderStatus === ORDER_STATUS.CANCELLED || orderStatus === ORDER_STATUS.RETURNED

  return (
    <>
      <Head>
        <title>Chi tiết đơn hàng #{orderDetail.id} - Thổ mộc</title>
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/my-orders')}
            sx={{ color: '#666', textTransform: 'none' }}
          >
            {t('back_to_orders')}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#888' }}>
              {t('order_code_label')}: <b>#{orderDetail.id}</b>
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#888' }}>|</Typography>
            <Chip
              label={t(ORDER_STATUS_LABELS[orderStatus]) || orderStatus}
              size='small'
              sx={{
                backgroundColor: ORDER_STATUS_COLORS[orderStatus] || '#888',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px'
              }}
            />
          </Box>
        </Box>

        {/* Order Progress */}
        {!isCancelledOrReturned && (
          <Paper sx={{ p: 3, mb: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {ORDER_STEPS.map(step => (
                <Step key={step.status}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': { fontSize: '13px' },
                      '& .MuiStepIcon-root.Mui-active': { color: PRIMARY_COLOR },
                      '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' }
                    }}
                  >
                    {t(`${step.label}`)}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        )}

        {/* Cancelled / Returned Notice */}
        {isCancelledOrReturned && (
          <Paper
            sx={{
              p: 3,
              mb: 2,
              backgroundColor:
                orderStatus === ORDER_STATUS.CANCELLED ? 'rgba(158,158,158,0.08)' : 'rgba(244,67,54,0.08)',
              border: `1px solid ${ORDER_STATUS_COLORS[orderStatus]}`
            }}
          >
            <Typography sx={{ fontWeight: 600, color: ORDER_STATUS_COLORS[orderStatus], fontSize: '16px' }}>
              {t(ORDER_STATUS_LABELS[orderStatus])}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#666', mt: 0.5 }}>
              {orderStatus === ORDER_STATUS.CANCELLED ? t('order_cancelled') : t('order_returned')}
            </Typography>
          </Paper>
        )}

        {/* Receiver Info */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: PRIMARY_COLOR }}>
              {t('receiver_info')}
            </Typography>
          </Box>

          {receiver ? (
            <Box sx={{ pl: 0.5 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5 }}>{receiver.name}</Typography>
              <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.25 }}>(+84) {receiver.phone}</Typography>
              <Typography sx={{ fontSize: '13px', color: '#666' }}>{receiver.address}</Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '13px', color: '#999' }}>{t('no_receiver_info')}</Typography>
          )}
        </Paper>

        {/* Product Items */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>{t('products')}</Typography>

          {/* Table header */}
          <Grid container sx={{ py: 1, borderBottom: '1px solid #e0e0e0', display: { xs: 'none', md: 'flex' } }}>
            <Grid item md={6}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>{t('product_name')}</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>{t('unit_price')}</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>{t('quantity')}</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'right' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>{t('total_amount')}</Typography>
            </Grid>
          </Grid>

          {items.map((item, index) => {
            const total = (item.skuPrice || 0) * (item.quantity || 0)

            return (
              <Grid
                container
                key={item.id || index}
                alignItems='center'
                sx={{
                  py: 2,
                  borderBottom: index < items.length - 1 ? '1px solid #f5f5f5' : 'none',
                  cursor: item.productId ? 'pointer' : 'default',
                  '&:hover': { backgroundColor: item.productId ? '#fafafa' : 'transparent' }
                }}
                onClick={() => {
                  if (item.productId) router.push(`/product/${item.productId}`)
                }}
              >
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {getItemName(item)}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#888', mt: 0.5 }}>
                        Phân loại: {item.skuValue || 'Mặc định'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '13px' }}>{(item.skuPrice || 0).toLocaleString()}đ</Typography>
                </Grid>
                <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '13px' }}>x{item.quantity}</Typography>
                </Grid>
                <Grid item xs={4} md={2} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '14px', color: PRIMARY_COLOR, fontWeight: 500 }}>
                    {total.toLocaleString()}đ
                  </Typography>
                </Grid>
              </Grid>
            )
          })}
        </Paper>

        {/* Delivery & Payment Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Delivery Method */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShippingOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>{t('delivery_method')}</Typography>
              </Box>

              {deliveryMethod ? (
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: '14px', mb: 0.5 }}>{deliveryMethod.name}</Typography>
                  <Typography sx={{ fontSize: '13px', color: PRIMARY_COLOR }}>
                    Phí vận chuyển: {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString()}đ`}
                  </Typography>
                  {deliveryMethod.description && (
                    <Typography sx={{ fontSize: '12px', color: '#888', mt: 0.5 }}>
                      {deliveryMethod.description}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '13px', color: '#999' }}>{t('no_delivery_info')}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Payment Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PaymentOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>{t('payment_info')}</Typography>
              </Box>

              {payment ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {(payment as any).paymentMethod?.name || 'Không xác định'}
                    </Typography>
                    <Chip
                      label={t(PAYMENT_STATUS_LABELS[payment.status]) || payment.status}
                      size='small'
                      sx={{
                        backgroundColor: PAYMENT_STATUS_COLORS[payment.status] || '#888',
                        color: 'white',
                        fontSize: '11px',
                        height: 22
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#666' }}>
                    {t('payment_amount')}: {((payment as any).amount || 0).toLocaleString()}đ
                  </Typography>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '13px', color: '#999' }}>{t('no_payment_info')}</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Order Summary */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>{t('order_summary')}</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: '14px', color: '#666' }}>
              {t('product_total')} ({items.reduce((sum, i) => sum + (i.quantity || 0), 0)} {t('product1')})
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>{productTotal.toLocaleString()}đ</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: '14px', color: '#666' }}>{t('shipping_fee')}</Typography>
            <Typography sx={{ fontSize: '14px' }}>
              {shippingFee === 0 ? t('free_shipping') : `${shippingFee.toLocaleString()}đ`}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>{t('grand_total')}</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: PRIMARY_COLOR }}>
              {grandTotal.toLocaleString()}đ
            </Typography>
          </Box>
        </Paper>

        {/* Order Info & Actions */}
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography sx={{ fontSize: '13px', color: '#888', mb: 0.5 }}>
                {t('order_id')}: <b>#{orderDetail.id}</b>
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#888', mb: 0.5 }}>
                {t('order_date')}:{' '}
                {new Date(orderDetail.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#888' }}>
                {t('last_updated')}:{' '}
                {new Date(orderDetail.updatedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}
            >
              {orderStatus === ORDER_STATUS.PENDING_PAYMENT && (
                <Button
                  variant='contained'
                  startIcon={<PaymentOutlinedIcon />}
                  onClick={() => setPaymentDialogOpen(true)}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#1677ff',
                    '&:hover': { backgroundColor: '#0958d9' }
                  }}
                >
                  {t('pay_now')}
                </Button>
              )}
              {canCancel(orderStatus) && (
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={cancellingOrder ? <CircularProgress size={16} /> : <CancelOutlinedIcon />}
                  onClick={handleCancelOrder}
                  disabled={cancellingOrder}
                  sx={{ textTransform: 'none' }}
                >
                  {t('cancel_order')}
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Payment QR Dialog */}
      <PaymentQRDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false)
          dispatch(fetchOrderDetailAsync(Number(id)))
        }}
        orderId={orderDetail.id}
        onPaymentSuccess={() => {
          setTimeout(() => {
            dispatch(fetchOrderDetailAsync(Number(id)))
          }, 1500)
        }}
      />
    </>
  )
}

OrderDetailPage.guestGuard = false
OrderDetailPage.authGuard = true
