import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { PLACEHOLDER_IMAGE } from 'src/configs/place_holder'
import { useAuth } from 'src/hooks/useAuth'
import { getActiveDeliveryMethods, getActivePaymentMethods } from 'src/service/order'
import { AppDispatch, RootState } from 'src/stores'
import { deselectAllItems } from 'src/stores/apps/cart'
import { fetchCartAsync } from 'src/stores/apps/cart/actions'
import { createOrderAsync } from 'src/stores/apps/order/actions'
import { CartItemDetailType, ShopCartType } from 'src/types/cart'
import { CreateOrderBodyType, ReceiverType } from 'src/types/order'

const PRIMARY_COLOR = '#1677ff'

interface DeliveryMethodOption {
  id: number
  name: string
  code: string
  price: number
  description?: string
  isActive: boolean
}

interface PaymentMethodOption {
  id: number
  name: string
  code: string
  isActive: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { items, selectedItems } = useSelector((state: RootState) => state.cart)
  const { isCreating } = useSelector((state: RootState) => state.order)

  // Receiver info - load from localStorage if available
  const [receiver, setReceiver] = useState<ReceiverType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('checkout_receiver')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {}
      }
    }

    return { name: '', phone: '', address: '' }
  })
  const [receiverErrors, setReceiverErrors] = useState<Record<string, string>>({})

  // Delivery & Payment
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethodOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([])
  const [selectedDeliveryCode, setSelectedDeliveryCode] = useState<string>('')
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string>('')
  const [loadingMethods, setLoadingMethods] = useState(true)

  // Buy now mode
  //   const { buyNow, skuId: buyNowSkuId, quantity: buyNowQuantity } = router.query

  // Get selected shop groups
  const selectedShopGroups = useMemo(() => {
    const groups: Array<{
      shop: ShopCartType['shop']
      cartItems: CartItemDetailType[]
    }> = []

    items.forEach(shopGroup => {
      const selectedCartItems = (shopGroup.cartItems || []).filter(
        item => item?.id && selectedItems.includes(item.id)
      ) as CartItemDetailType[]

      if (selectedCartItems.length > 0) {
        groups.push({
          shop: shopGroup.shop,
          cartItems: selectedCartItems
        })
      }
    })

    return groups
  }, [items, selectedItems])

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoadingMethods(true)
        const [deliveryRes, paymentRes] = await Promise.all([getActiveDeliveryMethods(), getActivePaymentMethods()])

        const deliveries: DeliveryMethodOption[] = (deliveryRes?.data?.data || deliveryRes?.data || []).filter(
          (d: DeliveryMethodOption) => d.isActive
        )
        const payments: PaymentMethodOption[] = (paymentRes?.data?.data || paymentRes?.data || []).filter(
          (p: PaymentMethodOption) => p.isActive
        )

        setDeliveryMethods(deliveries)
        setPaymentMethods(payments)

        if (deliveries.length > 0) setSelectedDeliveryCode(deliveries[0].code)
        if (payments.length > 0) setSelectedPaymentCode(payments[0].code)
      } catch (error) {
        console.error('Error fetching methods:', error)
        toast.error('Không thể tải phương thức vận chuyển/thanh toán')
      } finally {
        setLoadingMethods(false)
      }
    }
    fetchMethods()
  }, [])

  // Pre-fill receiver from user info (only if not already saved in localStorage)
  useEffect(() => {
    if (user) {
      setReceiver(prev => ({
        name: prev.name || user.name || '',
        phone: prev.phone || user.phoneNumber || '',
        address: prev.address || ''
      }))
    }
  }, [user])

  // Save receiver to localStorage whenever it changesKhông có phương thức thanh toán khả dụng

  useEffect(() => {
    if (receiver.name || receiver.phone || receiver.address) {
      localStorage.setItem('checkout_receiver', JSON.stringify(receiver))
    }
  }, [receiver])

  // Calculate totals
  const selectedDeliveryMethod = deliveryMethods.find(d => d.code === selectedDeliveryCode)
  const shippingFee = selectedDeliveryMethod?.price || 0

  const { productTotal, totalQuantity } = useMemo(() => {
    let total = 0
    let qty = 0
    selectedShopGroups.forEach(group => {
      group.cartItems.forEach(item => {
        const price = item.sku?.price ?? 0
        total += price * (item.quantity || 0)
        qty += item.quantity || 0
      })
    })

    return { productTotal: total, totalQuantity: qty }
  }, [selectedShopGroups])

  const totalShippingFee = shippingFee * selectedShopGroups.length
  const grandTotal = productTotal + totalShippingFee

  // Helpers
  const getProductName = (item: CartItemDetailType) => {
    const translations = item.sku?.product?.productTranslations
    if (translations && translations.length > 0 && translations[0]?.name) {
      return translations[0].name
    }

    return item.sku?.product?.name || 'Sản phẩm'
  }

  const getProductImage = (item: CartItemDetailType) => {
    if (item.sku?.image) return item.sku.image
    const images = item.sku?.product?.images
    if (images && images.length > 0 && images[0]) return images[0]

    return PLACEHOLDER_IMAGE
  }

  // Validate receiver
  const validateReceiver = (): boolean => {
    const errors: Record<string, string> = {}
    if (!receiver.name.trim()) errors.name = 'Vui lòng nhập tên người nhận'
    if (!receiver.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
    else if (receiver.phone.trim().length < 9) errors.phone = 'Số điện thoại không hợp lệ'
    if (!receiver.address.trim()) errors.address = 'Vui lòng nhập địa chỉ'
    setReceiverErrors(errors)

    return Object.keys(errors).length === 0
  }

  // Handle checkout
  const handlePlaceOrder = async () => {
    if (!validateReceiver()) return

    if (!selectedDeliveryCode) {
      toast.error('Vui lòng chọn phương thức vận chuyển')

      return
    }
    if (!selectedPaymentCode) {
      toast.error('Vui lòng chọn phương thức thanh toán')

      return
    }

    if (selectedShopGroups.length === 0) {
      toast.error('Không có sản phẩm để đặt hàng')

      return
    }

    // Build order body: one order per shop
    const orderBody: CreateOrderBodyType = selectedShopGroups.map(group => ({
      shopId: group.shop?.id || 0,
      receiver: {
        name: receiver.name.trim(),
        phone: receiver.phone.trim(),
        address: receiver.address.trim()
      },
      cartItemIds: group.cartItems.map(item => item.id),
      paymentMethodCode: selectedPaymentCode,
      deliveryMethodCode: selectedDeliveryCode
    }))

    try {
      const result = await dispatch(createOrderAsync(orderBody)).unwrap()

      // Clear selected items and refresh cart
      dispatch(deselectAllItems())
      dispatch(fetchCartAsync({ page: 1, limit: 100 }))

      toast.success('Đặt hàng thành công!')

      // Redirect to order list or order detail
      const orders = result?.data?.data || []
      if (orders.length === 1 && orders[0]?.id) {
        router.push(`/my-orders/${orders[0].id}`)
      } else {
        router.push('/my-orders')
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Đặt hàng thất bại'
      toast.error(message)
    }
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Vui lòng đăng nhập để thanh toán
        </Typography>
        <Button variant='contained' onClick={() => router.push('/login')}>
          Đăng nhập
        </Button>
      </Box>
    )
  }

  if (loadingMethods) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>Thanh toán - Thổ mộc</title>
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Receiver Info */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PlaceOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: PRIMARY_COLOR }}>Địa Chỉ Nhận Hàng</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size='small'
                label='Họ tên người nhận'
                value={receiver.name}
                onChange={e => setReceiver(prev => ({ ...prev, name: e.target.value }))}
                error={!!receiverErrors.name}
                helperText={receiverErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size='small'
                label='Số điện thoại'
                value={receiver.phone}
                onChange={e => setReceiver(prev => ({ ...prev, phone: e.target.value }))}
                error={!!receiverErrors.phone}
                helperText={receiverErrors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size='small'
                label='Địa chỉ nhận hàng'
                value={receiver.address}
                onChange={e => setReceiver(prev => ({ ...prev, address: e.target.value }))}
                error={!!receiverErrors.address}
                helperText={receiverErrors.address}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Product List */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>Sản phẩm</Typography>

          {/* Header */}
          <Grid container sx={{ py: 1, borderBottom: '1px solid #e0e0e0', display: { xs: 'none', md: 'flex' } }}>
            <Grid item md={6}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>Sản phẩm</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>Đơn giá</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>Số lượng</Typography>
            </Grid>
            <Grid item md={2} sx={{ textAlign: 'right' }}>
              <Typography sx={{ color: '#888', fontSize: '13px' }}>Thành tiền</Typography>
            </Grid>
          </Grid>

          {selectedShopGroups.map((group, groupIndex) => (
            <Box key={group.shop?.id || groupIndex}>
              {/* Shop header */}
              <Box sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #f0f0f0' }}>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    borderRadius: 0.5,
                    fontSize: '11px',
                    fontWeight: 500
                  }}
                >
                  Yêu thích
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>{group.shop?.name || 'Shop'}</Typography>
              </Box>

              {/* Items */}
              {group.cartItems.map(item => {
                const price = item.sku?.price ?? 0
                const total = price * (item.quantity || 0)

                return (
                  <Grid container key={item.id} alignItems='center' sx={{ py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            position: 'relative',
                            flexShrink: 0,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #f0f0f0'
                          }}
                        >
                          <Image
                            src={getProductImage(item)}
                            alt={getProductName(item)}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {getProductName(item)}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#888' }}>
                            Phân loại: {item.sku?.value || 'Mặc định'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '13px' }}>{price.toLocaleString()}đ</Typography>
                    </Grid>
                    <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '13px' }}>{item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={4} md={2} sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '13px', color: PRIMARY_COLOR, fontWeight: 500 }}>
                        {total.toLocaleString()}đ
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })}
            </Box>
          ))}
        </Paper>

        {/* Delivery Method */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocalShippingOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Phương Thức Vận Chuyển</Typography>
          </Box>

          {deliveryMethods.length === 0 ? (
            <Typography sx={{ color: '#999', fontSize: '14px' }}>Không có phương thức vận chuyển khả dụng</Typography>
          ) : (
            <RadioGroup value={selectedDeliveryCode} onChange={e => setSelectedDeliveryCode(e.target.value)}>
              {deliveryMethods.map(method => (
                <FormControlLabel
                  key={method.id}
                  value={method.code}
                  control={<Radio size='small' />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{method.name}</Typography>
                      <Typography sx={{ fontSize: '13px', color: PRIMARY_COLOR }}>
                        {method.price === 0 ? 'Miễn phí' : `${method.price.toLocaleString()}đ`}
                      </Typography>
                      {method.description && (
                        <Typography sx={{ fontSize: '12px', color: '#888' }}>({method.description})</Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    border: selectedDeliveryCode === method.code ? `1px solid ${PRIMARY_COLOR}` : '1px solid #e0e0e0',
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 1,
                    mx: 0,
                    backgroundColor: selectedDeliveryCode === method.code ? 'rgba(22, 119, 255, 0.04)' : 'transparent'
                  }}
                />
              ))}
            </RadioGroup>
          )}
        </Paper>

        {/* Payment Method */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PaymentOutlinedIcon sx={{ color: PRIMARY_COLOR }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Phương Thức Thanh Toán</Typography>
          </Box>

          {paymentMethods.length === 0 ? (
            <Typography sx={{ color: '#999', fontSize: '14px' }}>Không có phương thức thanh toán khả dụng</Typography>
          ) : (
            <RadioGroup value={selectedPaymentCode} onChange={e => setSelectedPaymentCode(e.target.value)}>
              {paymentMethods.map(method => (
                <FormControlLabel
                  key={method.id}
                  value={method.code}
                  control={<Radio size='small' />}
                  label={<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{method.name}</Typography>}
                  sx={{
                    border: selectedPaymentCode === method.code ? `1px solid ${PRIMARY_COLOR}` : '1px solid #e0e0e0',
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mb: 1,
                    mx: 0,
                    backgroundColor: selectedPaymentCode === method.code ? 'rgba(22, 119, 255, 0.04)' : 'transparent'
                  }}
                />
              ))}
            </RadioGroup>
          )}
        </Paper>

        {/* Order Summary & Place Order */}
        <Paper sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>Chi Tiết Thanh Toán</Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: '14px', color: '#666' }}>Tổng tiền hàng ({totalQuantity} sản phẩm)</Typography>
            <Typography sx={{ fontSize: '14px' }}>{productTotal.toLocaleString()}đ</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: '14px', color: '#666' }}>
              Phí vận chuyển ({selectedShopGroups.length} shop)
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>{totalShippingFee.toLocaleString()}đ</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Tổng thanh toán</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: PRIMARY_COLOR }}>
              {grandTotal.toLocaleString()}đ
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={() => router.push('/cart')} sx={{ px: 4, py: 1.5 }}>
              Quay lại giỏ hàng
            </Button>
            <Button
              variant='contained'
              onClick={handlePlaceOrder}
              disabled={isCreating || selectedShopGroups.length === 0}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                px: 6,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0958d9' },
                '&:disabled': { backgroundColor: '#ccc' }
              }}
            >
              {isCreating ? <CircularProgress size={24} color='inherit' /> : 'Đặt Hàng'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

CheckoutPage.guestGuard = false
CheckoutPage.authGuard = true
