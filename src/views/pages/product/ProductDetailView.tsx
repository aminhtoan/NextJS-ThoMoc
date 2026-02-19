import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Rating,
  Paper,
  Breadcrumbs,
  IconButton,
  Avatar,
  Link as MuiLink
} from '@mui/material'
import {
  ShoppingCart,
  FavoriteBorder,
  Share,
  LocalShipping,
  Verified,
  NavigateNext,
  Add,
  Remove,
  StorefrontOutlined
} from '@mui/icons-material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

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
}

interface ProductDetailViewProps {
  product: ProductDetail
  defaultLanguage?: string
}

// ========== Constants ==========
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='%23f5f5f5'/%3E%3Ctext x='200' y='200' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='18' fill='%23bbb'%3ENo Image%3C/text%3E%3C/svg%3E"

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
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<Record<string, string>>({})
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(null)

  const { i18n } = useTranslation()

  useEffect(() => {
    const lang = i18n.language || defaultLanguage
    setCurrentLanguageId(mapLanguageToId(lang))
  }, [i18n.language, defaultLanguage])

  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE]
  const currentImage = images[selectedImageIndex] || images[0]

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
    const selectedValues = Object.values(selectedVariantOptions)
    if (selectedValues.length === 0) return null

    return product.skus.find(sku => {
      const skuParts = sku.value.split('-')

      return selectedValues.every(val => skuParts.includes(val))
    })
  }, [product.skus, selectedVariantOptions])

  const displayPrice = selectedSku ? selectedSku.price : product.basePrice

  const totalStock = useMemo(() => {
    if (!product.skus || product.skus.length === 0) return 999

    return product.skus.reduce((sum, sku) => sum + sku.stock, 0)
  }, [product.skus])

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariantOptions(prev => ({
      ...prev,
      [variantName]: prev[variantName] === option ? '' : option
    }))
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > (selectedSku?.stock || totalStock)) return prev

      return next
    })
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} sx={{ mb: 2 }}>
        <MuiLink component={Link} href='/' underline='hover' color='inherit' sx={{ fontSize: '14px' }}>
          Trang chủ
        </MuiLink>
        {categoryNames.map((name, index) => (
          <Typography key={index} sx={{ fontSize: '14px', color: '#555' }}>
            {name}
          </Typography>
        ))}
        <Typography sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>{product.name}</Typography>
      </Breadcrumbs>

      {/* Main Product Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '8px', mb: 3 }}>
        <Grid container spacing={3}>
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
                    backgroundColor: '#ee4d2d',
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
                  <Box sx={{ fontSize: '11px' }}>GIẢM</Box>
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
              {images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  sx={{
                    width: 82,
                    height: 82,
                    minWidth: 82,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImageIndex === index ? '2px solid #ee4d2d' : '2px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#ee4d2d' }
                  }}
                >
                  <Box
                    component='img'
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#555' }}>
                <Share sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: '14px' }}>Chia sẻ</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#555' }}>
                <FavoriteBorder sx={{ fontSize: 18, color: '#ee4d2d' }} />
                <Typography sx={{ fontSize: '14px' }}>Yêu thích</Typography>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Product Info */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              {product.brand && (
                <Chip
                  label='Yêu thích'
                  size='small'
                  sx={{
                    backgroundColor: '#ee4d2d',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '11px',
                    height: 22,
                    mt: 0.5,
                    borderRadius: '2px'
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  sx={{ fontSize: '16px', fontWeight: 500, color: '#ee4d2d', borderBottom: '1px solid #ee4d2d' }}
                >
                  4.7
                </Typography>
                <Rating value={4.7} readOnly precision={0.1} size='small' sx={{ color: '#ee4d2d' }} />
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500, borderBottom: '1px solid #555' }}>735</Typography>
                <Typography sx={{ fontSize: '14px', color: '#767676' }}>Đánh Giá</Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>3k+</Typography>
                <Typography sx={{ fontSize: '14px', color: '#767676' }}>Đã Bán</Typography>
              </Box>
            </Box>

            {/* Price */}
            <Box
              sx={{
                background: '#fafafa',
                p: 2,
                borderRadius: '4px',
                mb: 3,
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
              <Typography sx={{ fontSize: { xs: '24px', md: '30px' }, fontWeight: 500, color: '#ee4d2d' }}>
                {formatPrice(displayPrice)}
              </Typography>
              {hasDiscount && (
                <Chip
                  label={`${discountPercentage}% GIẢM`}
                  size='small'
                  sx={{
                    backgroundColor: '#ee4d2d',
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
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1} alignItems='flex-start'>
                <Grid item xs={3} sm={2}>
                  <Typography sx={{ fontSize: '14px', color: '#757575' }}>Vận Chuyển</Typography>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <LocalShipping sx={{ fontSize: 20, color: '#26aa99' }} />
                    <Typography sx={{ fontSize: '14px', color: '#222' }}>Miễn phí vận chuyển</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#26aa99', fontWeight: 500 }}>Phí ship 0đ</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Brand */}
            {product.brand && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1} alignItems='center'>
                  <Grid item xs={3} sm={2}>
                    <Typography sx={{ fontSize: '14px', color: '#757575' }}>Thương hiệu</Typography>
                  </Grid>
                  <Grid item xs={9} sm={10}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {product.brand.logo && (
                        <Avatar src={product.brand.logo} sx={{ width: 24, height: 24 }} variant='rounded' />
                      )}
                      <Typography sx={{ fontSize: '14px', color: '#08f', fontWeight: 500 }}>
                        {product.brand.name}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Variants */}
            {product.variants?.length > 0 &&
              product.variants.map((variant, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={1} alignItems='flex-start'>
                    <Grid item xs={3} sm={2}>
                      <Typography sx={{ fontSize: '14px', color: '#757575', pt: 1 }}>{variant.value}</Typography>
                    </Grid>
                    <Grid item xs={9} sm={10}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {variant.options.map((option, optIndex) => {
                          const isSelected = selectedVariantOptions[variant.value] === option
                          const matchingSku = product.skus?.find(sku => sku.value.includes(option))

                          return (
                            <Button
                              key={optIndex}
                              variant='outlined'
                              onClick={() => handleVariantSelect(variant.value, option)}
                              sx={{
                                minWidth: 'auto',
                                px: 2,
                                py: 1,
                                fontSize: '14px',
                                textTransform: 'none',
                                color: isSelected ? '#ee4d2d' : '#333',
                                borderColor: isSelected ? '#ee4d2d' : '#e0e0e0',
                                backgroundColor: isSelected ? '#fff0ed' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: '2px',
                                '&:hover': {
                                  borderColor: '#ee4d2d',
                                  backgroundColor: isSelected ? '#fff0ed' : '#fafafa'
                                }
                              }}
                            >
                              {matchingSku?.image && (
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
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={1} alignItems='center'>
                <Grid item xs={3} sm={2}>
                  <Typography sx={{ fontSize: '14px', color: '#757575' }}>Số Lượng</Typography>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '2px',
                        width: 32,
                        height: 32,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Remove sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Box
                      sx={{
                        width: 50,
                        height: 32,
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
                        width: 32,
                        height: 32,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Add sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography sx={{ ml: 2, fontSize: '14px', color: '#757575' }}>
                      {selectedSku ? selectedSku.stock : totalStock} sản phẩm có sẵn
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant='outlined'
                startIcon={<ShoppingCart />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: '#ee4d2d',
                  color: '#ee4d2d',
                  backgroundColor: '#fff0ed',
                  borderRadius: '2px',
                  fontWeight: 500,
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': { borderColor: '#ee4d2d', backgroundColor: '#fce4de' }
                }}
              >
                Thêm Vào Giỏ Hàng
              </Button>
              <Button
                variant='contained'
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '14px',
                  textTransform: 'none',
                  backgroundColor: '#ee4d2d',
                  borderRadius: '2px',
                  fontWeight: 500,
                  flex: { xs: 1, sm: 'none' },
                  '&:hover': { backgroundColor: '#d73211' }
                }}
              >
                Mua Ngay
              </Button>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Verified sx={{ fontSize: 18, color: '#ee4d2d' }} />
              <Typography sx={{ fontSize: '13px', color: '#222' }}>
                Trả hàng miễn phí 15 ngày | Hàng chính hãng 100%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Shop Info */}
      {product.brand && (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '8px', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Avatar
              src={product.brand.logo}
              sx={{ width: 64, height: 64, border: '2px solid #ee4d2d' }}
              variant='rounded'
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>{product.brand.name}</Typography>
              <Typography sx={{ fontSize: '13px', color: '#757575', mt: 0.5 }}>Online vài phút trước</Typography>
            </Box>
            <Button
              variant='outlined'
              startIcon={<StorefrontOutlined />}
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: '13px',
                borderColor: '#ee4d2d',
                color: '#ee4d2d',
                borderRadius: '2px',
                '&:hover': { borderColor: '#d73211', backgroundColor: '#fff0ed' }
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
                  <Typography sx={{ fontSize: '13px', color: '#ee4d2d', fontWeight: 500 }}>{stat.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Product Description */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '8px', mb: 3 }}>
        <Box sx={{ backgroundColor: '#fafafa', p: 2, mb: 2, borderRadius: '2px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#222', textTransform: 'uppercase' }}>
            MÔ TẢ SẢN PHẨM
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#222',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            ✅ CHI TIẾT SẢN PHẨM
          </Typography>
          <Box
            sx={{
              '& > div': {
                display: 'flex',
                py: 1,
                borderBottom: '1px solid #f5f5f5',
                '&:last-child': { borderBottom: 'none' }
              }
            }}
          >
            {product.categories?.length > 0 && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>Danh Mục</Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{categoryNames.join(' > ')}</Typography>
              </Box>
            )}
            {product.brand && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                  Thương Hiệu
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{product.brand.name}</Typography>
              </Box>
            )}
            <Box>
              <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>Kho hàng</Typography>
              <Typography sx={{ fontSize: '14px', color: '#222' }}>{totalStock}</Typography>
            </Box>
            {product.skus?.length > 0 && (
              <Box>
                <Typography sx={{ width: 150, fontSize: '14px', color: '#757575', flexShrink: 0 }}>
                  Phân loại
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#222' }}>{product.skus.length} loại</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#222',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📝 MÔ TẢ SẢN PHẨM
          </Typography>
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
    </Box>
  )
}

export default ProductDetailView
