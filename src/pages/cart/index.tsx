// **  MUI icon
import AddIcon from '@mui/icons-material/Add'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import RemoveIcon from '@mui/icons-material/Remove'

// ** MUI components
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'

// ** Next
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** Custom components
import ChatListWidget from 'src/components/ChatWidget'

// ** Configs
import { PLACEHOLDER_IMAGE } from 'src/configs/place_holder'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Services
import { getAccessToken } from 'src/service/token'

// ** Stores
import { AppDispatch, RootState } from 'src/stores'
import { deselectAllItems, selectAllItems, setSelectedItems, toggleSelectItem } from 'src/stores/apps/cart'
import { fetchCartAsync, removeCartItemAsync, updateCartItemAsync } from 'src/stores/apps/cart/actions'

// ** Types
import { CartItemDetailType, ShopCartType } from 'src/types/cart'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { items, isLoading, selectedItems } = useSelector((state: RootState) => state.cart)
  const [isOpenChat, setIsOpenChat] = useState(false)
  const [selectedShopForChat, setSelectedShopForChat] = useState<number | undefined>(undefined)
  const authToken = JSON.parse(getAccessToken() || 'null')
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())
  const PRIMARY_COLOR = '#1677ff'
  const { t } = useTranslation()

  useEffect(() => {
    if (user) {
      dispatch(fetchCartAsync({ page: 1, limit: 100 }))
    }
  }, [dispatch, user])

  const toggleChat = () => setIsOpenChat(prev => !prev)

  // Get all cart item IDs
  const allCartItemIds = useMemo(() => {
    const ids: number[] = []
    items.forEach(shop => {
      shop.cartItems?.forEach(item => {
        if (item?.id) ids.push(item.id)
      })
    })

    return ids
  }, [items])

  // Check if all items are selected
  const isAllSelected = allCartItemIds.length > 0 && selectedItems.length === allCartItemIds.length

  // Calculate total price and quantity of selected items
  const { totalPrice, totalSelectedQuantity } = useMemo(() => {
    let price = 0
    let quantity = 0
    items.forEach(shop => {
      shop.cartItems?.forEach(item => {
        if (item?.id && selectedItems.includes(item.id)) {
          const itemPrice = item.sku?.price ?? 0
          price += itemPrice * (item.quantity || 0)
          quantity += item.quantity || 0
        }
      })
    })

    return { totalPrice: price, totalSelectedQuantity: quantity }
  }, [items, selectedItems])

  const handleSelectAll = () => {
    if (isAllSelected) {
      dispatch(deselectAllItems())
    } else {
      dispatch(selectAllItems())
    }
  }

  const handleSelectShop = (shop: ShopCartType) => {
    const shopItemIds = shop.cartItems?.map(item => item?.id).filter(Boolean) as number[]
    const allShopSelected = shopItemIds.every(id => selectedItems.includes(id))

    if (allShopSelected) {
      // Deselect all shop items
      const newSelected = selectedItems.filter(id => !shopItemIds.includes(id))
      dispatch(setSelectedItems(newSelected))
    } else {
      // Select all shop items
      const newSelected = [...new Set([...selectedItems, ...shopItemIds])]
      dispatch(setSelectedItems(newSelected))
    }
  }

  const handleToggleItem = (itemId: number) => {
    dispatch(toggleSelectItem(itemId))
  }

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1 || newQuantity > maxStock) return

    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    try {
      // Find the cart item across all shops
      let cartItem: CartItemDetailType | undefined
      items.forEach(shop => {
        const found = shop.cartItems?.find(item => item.id === cartItemId)
        if (found) cartItem = found
      })

      await dispatch(
        updateCartItemAsync({ cartItemId, data: { skuId: cartItem?.skuId || 0, quantity: newQuantity } })
      ).unwrap()
    } catch (error) {
      toast.error('Không thể cập nhật số lượng')
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)

        return newSet
      })
    }
  }

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await dispatch(removeCartItemAsync([cartItemId])).unwrap()
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error: any) {
      console.error('Failed to remove cart item:', error)
      toast.error('Không thể xóa sản phẩm')
    }
  }

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return
    try {
      await dispatch(removeCartItemAsync(selectedItems)).unwrap()
      toast.success('Đã xóa các sản phẩm đã chọn')
    } catch (error) {
      toast.error('Không thể xóa sản phẩm')
    }
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để thanh toán')

      return
    }
    router.push('/checkout')
  }

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

  if (isLoading && items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Head>
        <title>Giỏ hàng - Thổ mộc</title>
      </Head>

      <Box sx={{ mx: { xs: 2, md: 6 }, py: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {items.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant='h6' sx={{ color: '#999', mb: 2 }}>
              {t('cart_empty_message')}
            </Typography>
            <Button
              sx={{
                backgroundColor: PRIMARY_COLOR,
                color: 'white',
                '&:hover': { backgroundColor: '#d73211' }
              }}
              onClick={() => router.push('/')}
            >
              {t('continue_shopping')}
            </Button>
          </Paper>
        ) : (
          <>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} sx={{ mr: 2 }} />
              <Grid container alignItems='center'>
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontWeight: 500 }}>{t('products')}</Typography>
                </Grid>
                <Grid item xs={12} md={2} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{ color: '#888' }}>{t('unit_price')}</Typography>
                </Grid>
                <Grid item xs={12} md={2} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{ color: '#888' }}>{t('quantity')}</Typography>
                </Grid>
                <Grid item xs={12} md={2} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{ color: '#888' }}>{t('Total')}</Typography>
                </Grid>
                <Grid item xs={12} md={1} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                  <Typography sx={{ color: '#888' }}>{t('actions')}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Cart items by shop */}
            {items.map((shop, shopIndex) => {
              const shopItemIds = shop.cartItems?.map(item => item?.id).filter(Boolean) as number[]
              const allShopSelected = shopItemIds.length > 0 && shopItemIds.every(id => selectedItems.includes(id))

              return (
                <Paper key={shop.shop?.id || shopIndex} sx={{ mb: 2 }}>
                  {/* Shop header */}
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Checkbox checked={allShopSelected} onChange={() => handleSelectShop(shop)} />
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.5,
                        backgroundColor: PRIMARY_COLOR,
                        color: 'white',
                        borderRadius: 0.5,
                        fontSize: '12px',
                        fontWeight: 500,
                        mr: 1
                      }}
                    >
                      {t('Favorite')}
                    </Box>
                    <Typography sx={{ fontWeight: 600, mr: 1 }}>{shop.shop?.name || 'Shop'}</Typography>
                    <IconButton
                      size='small'
                      onClick={() => {
                        setSelectedShopForChat(shop.shop?.id)
                        setIsOpenChat(true)
                      }}
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {/* Cart items */}
                  {shop.cartItems?.map((item, itemIndex) => {
                    if (!item) return null
                    const isSelected = item.id ? selectedItems.includes(item.id) : false
                    const itemPrice = item.sku?.price ?? 0
                    const totalItemPrice = itemPrice * (item.quantity || 0)
                    const stock = item.sku?.stock || 0
                    const isUpdating = item.id ? updatingItems.has(item.id) : false

                    return (
                      <Box
                        key={item.id || itemIndex}
                        sx={{
                          p: 2,
                          borderBottom: itemIndex < (shop.cartItems?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <Grid container alignItems='center' spacing={2}>
                          {/* Checkbox + Product info */}
                          <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Checkbox checked={isSelected} onChange={() => item.id && handleToggleItem(item.id)} />
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
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
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover': { color: PRIMARY_COLOR }
                                  }}
                                  onClick={() => router.push(`/product/${item.sku?.productId}`)}
                                >
                                  {getProductName(item)}
                                </Typography>
                                <Typography sx={{ fontSize: '12px', color: '#888', mt: 0.5 }}>
                                  Phân loại: {item.sku?.value || 'Mặc định'}
                                </Typography>
                                {stock <= 5 && stock > 0 && (
                                  <Typography sx={{ fontSize: '12px', color: PRIMARY_COLOR, mt: 0.5 }}>
                                    Còn {stock} sản phẩm
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>

                          {/* Unit price */}
                          <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '14px' }}>{itemPrice.toLocaleString()}đ</Typography>
                          </Grid>

                          {/* Quantity */}
                          <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1
                              }}
                            >
                              <IconButton
                                size='small'
                                onClick={() =>
                                  item.id && handleUpdateQuantity(item.id, (item.quantity || 1) - 1, stock)
                                }
                                disabled={(item.quantity || 0) <= 1 || isUpdating}
                                sx={{ borderRadius: 0 }}
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                size='small'
                                sx={{
                                  width: 50,
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' }
                                  },
                                  '& input': { textAlign: 'center', p: 0.5 }
                                }}
                                inputProps={{ readOnly: true }}
                              />
                              <IconButton
                                size='small'
                                onClick={() =>
                                  item.id && handleUpdateQuantity(item.id, (item.quantity || 1) + 1, stock)
                                }
                                disabled={(item.quantity || 0) >= stock || isUpdating}
                                sx={{ borderRadius: 0 }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Grid>

                          {/* Total price */}
                          <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '14px', color: PRIMARY_COLOR, fontWeight: 500 }}>
                              {totalItemPrice.toLocaleString()}đ
                            </Typography>
                          </Grid>

                          {/* Actions */}
                          <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                              <Typography
                                sx={{
                                  fontSize: '12px',
                                  color: '#333',
                                  cursor: 'pointer',
                                  '&:hover': { color: PRIMARY_COLOR }
                                }}
                                onClick={() => item.id && handleRemoveItem(item.id)}
                              >
                                Xóa
                              </Typography>
                              <Typography sx={{ fontSize: '12px', color: PRIMARY_COLOR, cursor: 'pointer' }}>
                                Tìm sản phẩm tương tự
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  })}
                </Paper>
              )
            })}

            {/* Footer - checkout bar */}
            <Paper
              sx={{
                p: 2,
                position: 'sticky',
                bottom: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
              <Typography sx={{ cursor: 'pointer', mr: 3 }} onClick={handleSelectAll}>
                Chọn Tất Cả ({allCartItemIds.length})
              </Typography>
              <Typography
                sx={{ cursor: 'pointer', mr: 3, '&:hover': { color: PRIMARY_COLOR } }}
                onClick={handleRemoveSelected}
              >
                Xóa
              </Typography>
              <Typography sx={{ cursor: 'pointer', color: PRIMARY_COLOR, mr: 3 }}>
                Bỏ sản phẩm không hoạt động
              </Typography>

              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box>
                  <Typography component='span' sx={{ fontSize: '14px' }}>
                    Tổng cộng ({totalSelectedQuantity} sản phẩm):
                  </Typography>
                  <Typography component='span' sx={{ fontSize: '20px', color: PRIMARY_COLOR, fontWeight: 500, ml: 1 }}>
                    {totalPrice.toLocaleString()}đ
                  </Typography>
                </Box>

                <Button
                  variant='contained'
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    px: 6,
                    py: 1.5,
                    fontSize: '14px',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: '#d73211' },
                    '&:disabled': { backgroundColor: '#ccc' }
                  }}
                >
                  Mua Hàng
                </Button>
              </Box>
            </Paper>
          </>
        )}

        <ChatListWidget
          currentUserId={user?.id}
          isOpen={isOpenChat}
          toggleChat={toggleChat}
          authToken={authToken}
          targetUserId={selectedShopForChat}
        />
      </Box>
    </>
  )
}

CartPage.guestGuard = false
CartPage.authGuard = true
