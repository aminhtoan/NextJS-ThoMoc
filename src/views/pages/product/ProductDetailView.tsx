import {
  Add,
  LocalShipping,
  NavigateNext,
  Remove,
  ShoppingCart,
  StorefrontOutlined,
  Verified
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  Rating,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import ChatListWidget from 'src/components/ChatWidget'
import ProductReviews from 'src/components/ProductReviews'
import { useAuth } from 'src/hooks/useAuth'
import { getAccessToken } from 'src/service/token'
import { AppDispatch } from 'src/stores'
import { addToCartAsync, fetchCartAsync } from 'src/stores/apps/cart/actions'
import ShopOtherProducts from './components/ShopOtherProducts'
import { PLACEHOLDER_IMAGE } from 'src/configs/place_holder'
import RelatedProducts from './components/RelatedProducts'

// ========== Types ==========
interface SKU {
  id: number
  value: string
  price: number
  stock: number
  image: string
  productId: number
}

interface ProductTranslation {
  id: number
  productId: number
  languageId: string
  name: string
  description: string
}

interface Category {
  id: number
  name: string
  logo: string | null
  categoryTranslations?: Array<{
    name: string
    description: string
    languageId: string
  }>
}

interface Brand {
  id: number
  name: string
  logo: string
}

interface ProductDetail {
  id: number
  name: string
  basePrice: number
  virtualPrice: number
  brandId: number
  images: string[]
  variants: Array<{ value: string; options: string[] }>
  productTranslations: ProductTranslation[]
  skus: SKU[]
  categories: Category[]
  brand: Brand
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  totalSold: number
  reviewCount: number
  avgRating: number
}

interface ProductDetailViewProps {
  product: ProductDetail
  defaultLanguage?: string
}

// ========== Theme Color ==========
const PRIMARY = '#1565c0' // xanh header
const PRIMARY_LIGHT = '#e3f0fb' // nền nhạt
const PRIMARY_HOVER = '#0d47a1' // hover đậm hơn
const PRIMARY_BG = '#e8f0fe' // background nhạt cho price box

// ========== Helper ==========
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫'
}

const mapLanguageToId = (lang: string): string => {
  const baseLang = lang.split('-')[0].toLowerCase()
  const mapping: Record<string, string> = {
    en: 'EN',
    vi: 'VI'
  }

  return mapping[baseLang] || 'EN'
}

// ========== Component ==========
const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, defaultLanguage = 'vi' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [overrideImage, setOverrideImage] = useState<string | null>(null) // ảnh override từ SKU màu
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<Record<string, string>>({})
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const authToken = JSON.parse(getAccessToken() || 'null')
  const [isOpenChat, setIsOpenChat] = useState(false)

  const toggleChat = () => {
    setIsOpenChat(prev => !prev)
  }
  useEffect(() => {
    const lang = i18n.language || defaultLanguage
    setCurrentLanguageId(mapLanguageToId(lang))
  }, [i18n.language, defaultLanguage])

  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE]
  const currentImage = overrideImage ?? images[selectedImageIndex] ?? images[0]

  const hasDiscount = product.virtualPrice > product.basePrice
  const discountPercentage = hasDiscount
    ? Math.round(((product.virtualPrice - product.basePrice) / product.virtualPrice) * 100)
    : 0

  const description = useMemo(() => {
    if (!currentLanguageId || !product.productTranslations) return ''
    const translation =
      product.productTranslations.find(t => t.languageId === currentLanguageId) ||
      product.productTranslations.find(t => t.languageId.toUpperCase() === currentLanguageId.toUpperCase())

    return translation?.description || product.productTranslations[0]?.description || ''
  }, [product.productTranslations, currentLanguageId])

  const translatedName = useMemo(() => {
    if (!currentLanguageId || !product.productTranslations) return product.name
    const translation =
      product.productTranslations.find(t => t.languageId === currentLanguageId) ||
      product.productTranslations.find(t => t.languageId.toUpperCase() === currentLanguageId.toUpperCase())

    return translation?.name || product.productTranslations[0]?.name || product.name
  }, [product, currentLanguageId])

  const categoryNames = useMemo(() => {
    if (!product.categories || !currentLanguageId) return []

    return product.categories.map(cat => {
      if (cat.categoryTranslations && cat.categoryTranslations.length > 0) {
        const translation = cat.categoryTranslations.find(t => t.languageId === currentLanguageId)

        return translation?.name || cat.categoryTranslations[0]?.name || cat.name
      }

      return cat.name
    })
  }, [product.categories, currentLanguageId])

  const selectedSku = useMemo(() => {
    if (!product.skus || product.skus.length === 0) return null
    const selectedValues = Object.values(selectedVariantOptions).filter(v => v) // Lọc bỏ giá trị rỗng

    if (selectedValues.length === 0) return null

    const found = product.skus.find(sku => {
      // Kiểm tra xem tất cả selected values có trong sku.value không
      return selectedValues.every(val => sku.value.includes(val))
    })

    return found
  }, [product.skus, selectedVariantOptions])

  const displayPrice = selectedSku ? selectedSku.price : product.basePrice

  const totalStock = useMemo(() => {
    if (!product.skus || product.skus.length === 0) return 999

    return product.skus.reduce((sum, sku) => sum + sku.stock, 0)
  }, [product.skus])

  const handleVariantSelect = (variantName: string, option: string) => {
    const isDeselecting = selectedVariantOptions[variantName] === option

    setSelectedVariantOptions(prev => ({
      ...prev,
      [variantName]: isDeselecting ? '' : option
    }))

    // Xử lý chuyển ảnh cho BẤT KỲ variant nào có SKU với ảnh
    if (isDeselecting) {
      // Bỏ chọn → reset về ảnh đầu gallery
      setOverrideImage(null)
      setSelectedImageIndex(0)
    } else {
      // Chọn option => tìm ảnh SKU tương ứng
      const matchingSku = product.skus?.find(sku => sku.value.includes(option))
      if (matchingSku?.image) {
        const imgIndex = images.findIndex(img => img === matchingSku.image)
        if (imgIndex !== -1) {
          // Ảnh có trong galler => dùng index
          setOverrideImage(null)
          setSelectedImageIndex(imgIndex)
        } else {
          // Ảnh không trong gallery => override trực tiếp
          setOverrideImage(matchingSku.image)
        }
      }
    }
  }

  // Click thumbnail → xoá override, dùng gallery bình thường
  const handleThumbnailClick = (index: number) => {
    setOverrideImage(null)
    setSelectedImageIndex(index)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > (selectedSku?.stock || totalStock)) return prev

      return next
    })
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t('Please login to add to cart'))
      router.push('/login')

      return
    }

    // Check if variants are selected
    if (product.variants && product.variants.length > 0) {
      const allSelected = product.variants.every(
        variant => selectedVariantOptions[variant.value] && selectedVariantOptions[variant.value] !== ''
      )
      if (!allSelected) {
        toast.error(t('Please select product options'))

        return
      }
    }

    // Get SKU ID
    let skuId: number | null = null
    if (selectedSku) {
      skuId = selectedSku.id
    } else if (product.skus && product.skus.length > 0) {
      // Default to first SKU if no variant selection required
      skuId = product.skus[0].id
    }

    if (!skuId) {
      toast.error(t('Product not available'))

      return
    }

    setIsAddingToCart(true)
    try {
      await dispatch(addToCartAsync({ skuId, quantity })).unwrap()
      toast.success(t('Added to cart successfully'))

      dispatch(fetchCartAsync({ page: 1, limit: 100 }))
    } catch (error: any) {
      toast.error(error?.message || t('Failed to add to cart'))
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      toast.error(t('Please login to continue'))
      router.push('/login')

      return
    }

    // Check if variants are selected
    if (product.variants && product.variants.length > 0) {
      const allSelected = product.variants.every(
        variant => selectedVariantOptions[variant.value] && selectedVariantOptions[variant.value] !== ''
      )
      if (!allSelected) {
        toast.error(t('Please select product options'))

        return
      }
    }

    // Get SKU ID
    let skuId: number | null = null
    if (selectedSku) {
      skuId = selectedSku.id
    } else if (product.skus && product.skus.length > 0) {
      skuId = product.skus[0].id
    }

    if (!skuId) {
      toast.error(t('Product not available'))

      return
    }

    setIsAddingToCart(true)
    try {
      await dispatch(addToCartAsync({ skuId, quantity })).unwrap()
      router.push('/cart')
    } catch (error: any) {
      toast.error(error?.message || t('Failed to add to cart'))
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} sx={{ mb: 2 }}>
        <MuiLink component={Link} href='/' underline='hover' color='inherit' sx={{ fontSize: '14px' }}>
          {t('Home')}
        </MuiLink>
        {categoryNames.map((name, index) => (
          <Typography key={index} sx={{ fontSize: '14px', color: '#555' }}>
            {name}
          </Typography>
        ))}
        <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>{translatedName}</Typography>
      </Breadcrumbs>

      {/* Main Product Section */}
      <Paper sx={{ p: 5, pb: 5, borderRadius: '8px', mb: 3 }}>
        <Grid container spacing={4}>
          {/* LEFT: Image Gallery */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #eee',
                mb: 1.5,
                backgroundColor: '#fafafa'
              }}
            >
              <Box
                component='img'
                src={currentImage}
                alt={product.name}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {hasDiscount && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: PRIMARY,
                    color: '#fff',
                    px: 1,
                    py: 0.5,
                    fontSize: '12px',
                    fontWeight: 700,
                    borderBottomLeftRadius: '4px',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  <Box sx={{ fontSize: '16px', fontWeight: 800 }}>{discountPercentage}%</Box>
                  <Box sx={{ fontSize: '11px' }}>{t('Discount')}</Box>
                </Box>
              )}
            </Box>

            {/* Thumbnails */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#ddd', borderRadius: 2 }
              }}
            >
              {images.map((img, index) => {
                const isActive = !overrideImage && selectedImageIndex === index

                return (
                  <Box
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    sx={{
                      width: 82,
                      height: 82,
                      minWidth: 82,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isActive ? `2px solid ${PRIMARY}` : '2px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: PRIMARY }
                    }}
                  >
                    <Box
                      component='img'
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                )
              })}
            </Box>
          </Grid>

          {/* RIGHT: Product Info */}
          <Grid item xs={12} md={7}>
            {/* Title */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              {product.brand && (
                <Chip
                  label={t('Favorite')}
                  size='small'
                  sx={{
                    backgroundColor: PRIMARY,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '11px',
                    height: 22,
                    mt: 0.5,
                    borderRadius: '2px',
                    flexShrink: 0
                  }}
                />
              )}
              <Typography
                variant='h5'
                sx={{ fontSize: { xs: '16px', md: '20px' }, fontWeight: 500, color: '#222', lineHeight: 1.5, flex: 1 }}
              >
                {translatedName}
              </Typography>
            </Box>

            {/* Rating & Stats */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  sx={{ fontSize: '16px', fontWeight: 500, color: PRIMARY, borderBottom: `1px solid ${PRIMARY}` }}
                >
                  {product.avgRating}
                </Typography>
                <Rating value={product.avgRating} readOnly precision={0.1} size='small' sx={{ color: PRIMARY }} />
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500, borderBottom: '1px solid #555' }}>
                  {product.reviewCount}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#767676' }}>{t('Reviews')}</Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                  {product.totalSold >= 1000 ? `${(product.totalSold / 1000).toFixed(1)}k+` : product.totalSold}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#767676' }}>{t('Sold')}</Typography>
              </Box>
            </Box>

            {/* Price */}
            <Box
              sx={{
                background: PRIMARY_BG,
                p: 2.5,
                borderRadius: '4px',
                mb: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              {hasDiscount && (
                <Typography sx={{ fontSize: '16px', color: '#929292', textDecoration: 'line-through' }}>
                  {formatPrice(product.virtualPrice)}
                </Typography>
              )}
              <Typography sx={{ fontSize: { xs: '24px', md: '30px' }, fontWeight: 500, color: PRIMARY }}>
                {formatPrice(displayPrice)}
              </Typography>
              {hasDiscount && (
                <Chip
                  label={`${discountPercentage}% GIẢM`}
                  size='small'
                  sx={{
                    backgroundColor: PRIMARY,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '12px',
                    height: 22,
                    borderRadius: '2px'
                  }}
                />
              )}
            </Box>

            {/* Shipping */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={1} alignItems='flex-start'>
                <Grid item xs={3} sm={2}>
                  <Typography sx={{ fontSize: '14px', color: '#757575', pt: 0.5 }}>{t('Shipping')}</Typography>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <LocalShipping sx={{ fontSize: 20, color: '#26aa99' }} />
                    <Typography sx={{ fontSize: '14px', color: '#222' }}>{t('Free Shipping')}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#26aa99', fontWeight: 500 }}>
                    {t('Free shipping fee')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Variants */}
            {product.variants?.length > 0 &&
              product.variants.map((variant, variantIndex) => (
                <Box key={variantIndex} sx={{ mb: 6 }}>
                  <Grid container spacing={1} alignItems='flex-start'>
                    <Grid item xs={3} sm={2}>
                      <Typography sx={{ fontSize: '14px', color: '#757575', pt: 1.5 }}>{t(variant.value)}</Typography>
                    </Grid>
                    <Grid item xs={9} sm={10}>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {variant.options.map((option, optIndex) => {
                          const isSelected = selectedVariantOptions[variant.value] === option
                          const isFirstVariant = variantIndex === 0
                          const matchingSku = isFirstVariant
                            ? product.skus?.find(sku => sku.value.includes(option))
                            : null
                          const showImage = isFirstVariant && !!matchingSku?.image

                          return (
                            <Button
                              key={optIndex}
                              variant='outlined'
                              onClick={() => handleVariantSelect(variant.value, option)}
                              sx={{
                                minWidth: '70px',
                                px: 3,
                                py: 1.5,
                                fontSize: '14px',
                                textTransform: 'none',
                                color: isSelected ? PRIMARY : '#333',
                                borderColor: isSelected ? PRIMARY : '#e0e0e0',
                                backgroundColor: isSelected ? PRIMARY_LIGHT : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: '2px',
                                '&:hover': {
                                  borderColor: PRIMARY,
                                  backgroundColor: isSelected ? PRIMARY_LIGHT : '#fafafa'
                                }
                              }}
                            >
                              {showImage && (
                                <Box
                                  component='img'
                                  src={matchingSku.image}
                                  alt={option}
                                  sx={{ width: 24, height: 24, objectFit: 'cover', borderRadius: '2px' }}
                                />
                              )}
                              {option}
                            </Button>
                          )
                        })}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}

            {/* Quantity */}
            <Box sx={{ mb: 8, mt: 1 }}>
              <Grid container spacing={1} alignItems='center'>
                <Grid item xs={3} sm={2}>
                  <Typography sx={{ fontSize: '14px', color: '#757575' }}>{t('Số Lượng')}</Typography>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '2px',
                        width: 36,
                        height: 36,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Remove sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Box
                      sx={{
                        width: 56,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e0e0e0',
                        borderLeft: 'none',
                        borderRight: 'none',
                        fontSize: '16px',
                        fontWeight: 500
                      }}
                    >
                      {quantity}
                    </Box>
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '2px',
                        width: 36,
                        height: 36,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Add sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{ ml: 2, fontSize: '14px', color: '#757575' }}>
                      {selectedSku ? selectedSku.stock : totalStock} {t('Available Product')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Button
                variant='outlined'
                startIcon={isAddingToCart ? <CircularProgress size={20} /> : <ShoppingCart />}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  backgroundColor: PRIMARY_LIGHT,
                  borderRadius: '2px',
                  fontWeight: 500,
                  height: 42,
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': { borderColor: PRIMARY_HOVER, backgroundColor: '#c8ddf7' }
                }}
              >
                {t('Add to Cart')}
              </Button>
              <Button
                variant='contained'
                onClick={handleBuyNow}
                disabled={isAddingToCart}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                  backgroundColor: PRIMARY,
                  borderRadius: '2px',
                  fontWeight: 500,
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': { backgroundColor: PRIMARY_HOVER }
                }}
              >
                {t('Buy Now')}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Verified sx={{ fontSize: 18, color: PRIMARY }} />
              <Typography sx={{ fontSize: '13px', color: '#222' }}>{t('Return Policy')}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Shop Info */}
      {product.brand && (
        <Paper sx={{ p: 5, borderRadius: '8px', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Avatar
              src={product.brand.logo}
              sx={{ width: 64, height: 64, border: `1px solid #757575` }}
              variant='rounded'
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>{product.brand.name}</Typography>

              <Typography sx={{ fontSize: '13px', color: '#757575', mt: 0.5 }}>Online vài phút trước</Typography>
            </Box>

            <Button
              variant='outlined'
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: '13px',
                borderColor: PRIMARY,
                color: PRIMARY,
                borderRadius: '2px',
                '&:hover': { borderColor: PRIMARY_HOVER, backgroundColor: PRIMARY_LIGHT }
              }}
              onClick={toggleChat}
            >
              Chat Ngay
            </Button>

            <Button
              variant='outlined'
              startIcon={<StorefrontOutlined />}
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: '13px',
                borderColor: PRIMARY,
                color: PRIMARY,
                borderRadius: '2px',
                '&:hover': { borderColor: PRIMARY_HOVER, backgroundColor: PRIMARY_LIGHT }
              }}
            >
              Xem Shop
            </Button>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: 'Sản Phẩm', value: '150+' },
              { label: 'Đánh Giá', value: '4.8/5' },
              { label: 'Tỉ Lệ Phản Hồi', value: '98%' },
              { label: 'Tham Gia', value: '2 năm trước' }
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: '#757575' }}>{stat.label}:</Typography>
                  <Typography sx={{ fontSize: '13px', color: PRIMARY, fontWeight: 500 }}>{stat.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Product Description */}
      <Paper sx={{ p: 5, borderRadius: '8px', mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ backgroundColor: '#fafafa', p: 2, mt: 2, mb: 2, borderRadius: '2px' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#222', textTransform: 'uppercase' }}>
              {t('PRODUCT DETAILS')}
            </Typography>
          </Box>
          <Box
            sx={{
              '& > div': {
                display: 'flex',
                py: 1,
                borderBottom: '1px solid #f5f5f5',
                '&:last-child': { borderBottom: 'none' }
              },
              display: 'flex',
              gap: 5,
              flexDirection: 'column'
            }}
          >
            {product.categories?.length > 0 && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                  {t('category')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{categoryNames.join(' > ')}</Typography>
              </Box>
            )}
            {product.brand && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                  {t('brand')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{product.brand.name}</Typography>
              </Box>
            )}
            <Box>
              <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                {t('stock')}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#222' }}>{totalStock}</Typography>
            </Box>
            {product.skus?.length > 0 && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                  {t('Variant')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{product.skus.length}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 2, mt: 8 }}>
          <Box sx={{ backgroundColor: '#fafafa', p: 2, mb: 2, borderRadius: '2px' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#222', textTransform: 'uppercase' }}>
              {t('Description1')}
            </Typography>
          </Box>
          {description ? (
            <Typography
              sx={{ fontSize: '14px', color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <Box>
              <Typography sx={{ fontSize: '14px', color: '#333', lineHeight: 1.8, mb: 1 }}>
                <strong>Tên Sản Phẩm:</strong> {product.name}
              </Typography>
              {product.variants?.length > 0 && (
                <Typography sx={{ fontSize: '14px', color: '#333', lineHeight: 1.8, mb: 1 }}>
                  <strong>Phân loại:</strong>{' '}
                  {product.variants.map(v => `${v.value}: ${v.options.join(', ')}`).join(' | ')}
                </Typography>
              )}
              <Typography sx={{ fontSize: '14px', color: '#333', lineHeight: 1.8, mb: 1 }}>
                <strong>Giá:</strong> {formatPrice(product.basePrice)}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <ProductReviews productId={product.id} />

      <ShopOtherProducts shopId={product.brandId} />

      <RelatedProducts category={product.categories?.[0]?.id || 0} />

      <ChatListWidget currentUserId={user?.id} isOpen={isOpenChat} toggleChat={toggleChat} authToken={authToken!} />
    </Box>
  )
}

export default ProductDetailView
