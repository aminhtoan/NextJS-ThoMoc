import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Rating,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { NextPage } from 'next/types'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'
import useDebounce from 'src/hooks/useDebounce'

interface ProductItem {
  id: number
  name: string
  images: string[]
  basePrice: number
  reviewCount: number
  avgRating: number
}

interface ReviewMedia {
  id: number
  url: string
}

interface ReviewUser {
  id: number
  name: string
  avatar: string
}

interface ReviewItem {
  id: number
  content: string
  rating: number
  orderId: number
  productId: number
  userId: number
  updateCount: number
  createdAt: string
  updatedAt: string
  medias: ReviewMedia[]
  user: ReviewUser
}

const ProductReviewsPage: NextPage = () => {
  const { t } = useTranslation()

  // Product list state
  const [products, setProducts] = useState<ProductItem[]>([])
  const [productPage, setProductPage] = useState(1)
  const [productTotalPages, setProductTotalPages] = useState(1)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 500)

  // Review state (when a product is selected)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [reviewPage, setReviewPage] = useState(1)
  const [reviewTotalPages, setReviewTotalPages] = useState(1)
  const [reviewTotalItems, setReviewTotalItems] = useState(0)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products
  const fetchProducts = useCallback(async (pageNum: number, search?: string) => {
    setIsLoadingProducts(true)
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: '12' })
      if (search) params.append('search', search)
      const res = await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/admin/products?${params.toString()}`)
      const data = res?.data
      setProducts(data?.data || [])
      setProductTotalPages(data?.totalPages || 1)
      setProductPage(data?.page || pageNum)
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error(t('Failed to load products'))
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  // Fetch reviews for a product
  const fetchReviews = useCallback(async (productId: number, pageNum: number) => {
    setIsLoadingReviews(true)
    try {
      const res = await handleAPI(`${API_CONFIG.REVIEW.PRODUCT_REVIEWS}/${productId}?page=${pageNum}&limit=10`)
      const data = res?.data
      setReviews(data?.data || [])
      setReviewTotalPages(data?.totalPages || 1)
      setReviewTotalItems(data?.totalItems || 0)
      setReviewPage(data?.page || pageNum)
    } catch (error) {
      console.error('Failed to load reviews:', error)
      toast.error(t('Failed to load reviews'))
    } finally {
      setIsLoadingReviews(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(1, debouncedSearch)
  }, [fetchProducts, debouncedSearch])

  const handleProductClick = (product: ProductItem) => {
    setSelectedProduct(product)
    setReviewPage(1)
    fetchReviews(product.id, 1)
  }

  const handleBackToProducts = () => {
    setSelectedProduct(null)
    setReviews([])
    setReviewPage(1)
  }

  const handleDeleteClick = (reviewId: number) => {
    setDeletingId(reviewId)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId || !selectedProduct) return
    setIsDeleting(true)
    try {
      await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/admin/${deletingId}`, {}, 'delete')
      toast.success(t('Deleted successfully'))
      setDeleteConfirmOpen(false)
      setDeletingId(null)
      fetchReviews(selectedProduct.id, reviewPage)
      fetchProducts(productPage, debouncedSearch)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Failed to delete'))
    } finally {
      setIsDeleting(false)
    }
  }

  // ==================== PRODUCT LIST VIEW ====================
  if (!selectedProduct) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
          Đánh giá sản phẩm
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder='Tìm kiếm sản phẩm theo tên hoặc ID...'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{ mb: 3, maxWidth: 500 }}
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon color='action' />
              </InputAdornment>
            )
          }}
        />

        {isLoadingProducts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color='text.secondary'>Không tìm thấy sản phẩm nào</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {products.map(product => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: 6 }
                    }}
                  >
                    <CardActionArea onClick={() => handleProductClick(product)} sx={{ flexGrow: 1 }}>
                      <CardMedia
                        component='img'
                        height='160'
                        image={product.images?.[0] || '/images/placeholder.png'}
                        alt={product.name}
                        sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                      />
                      <CardContent>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 40
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            product.basePrice
                          )}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {product.avgRating > 0 ? (
                              <>
                                <Rating value={product.avgRating} readOnly size='small' precision={0.1} />
                                <Typography variant='caption' color='text.secondary'>
                                  ({product.avgRating})
                                </Typography>
                              </>
                            ) : (
                              <Typography variant='caption' color='text.secondary'>
                                Chưa có đánh giá
                              </Typography>
                            )}
                          </Box>
                          <Chip
                            size='small'
                            label={`${product.reviewCount} đánh giá`}
                            color={product.reviewCount > 0 ? 'primary' : 'default'}
                            variant='outlined'
                            sx={{ fontSize: '11px' }}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {productTotalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={productTotalPages}
                  page={productPage}
                  onChange={(_, newPage) => fetchProducts(newPage, debouncedSearch)}
                  color='primary'
                  shape='rounded'
                />
              </Box>
            )}
          </>
        )}
      </Box>
    )
  }

  // ==================== PRODUCT REVIEWS VIEW ====================
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBackToProducts} color='primary'>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Đánh giá: {selectedProduct.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {selectedProduct.avgRating > 0 && (
              <>
                <Rating value={selectedProduct.avgRating} readOnly size='small' precision={0.1} />
                <Typography variant='body2' color='text.secondary'>
                  {selectedProduct.avgRating}/5
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  •
                </Typography>
              </>
            )}
            <Typography variant='body2' color='text.secondary'>
              {reviewTotalItems} đánh giá
            </Typography>
          </Box>
        </Box>
        {selectedProduct.images?.[0] && (
          <Box
            component='img'
            src={selectedProduct.images[0]}
            sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover', border: '1px solid #eee' }}
          />
        )}
      </Box>

      {/* Reviews list */}
      {isLoadingReviews ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <StarIcon sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
            <Typography variant='h6' color='text.secondary'>
              {t('no_reviews')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('no_reviews_for_product')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {reviews.map(review => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                {/* Review header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={review.user?.avatar || '/images/default-avatar.png'} sx={{ width: 36, height: 36 }} />
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {review.user?.name || 'Ẩn danh'}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {review.updateCount > 0 && (
                          <Chip label={t('edited')} size='small' sx={{ ml: 1, height: 18, fontSize: '10px' }} />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`#${review.id}`} size='small' variant='outlined' sx={{ fontSize: '11px' }} />
                    <Tooltip title={t('delete_review_label')}>
                      <IconButton size='small' color='error' onClick={() => handleDeleteClick(review.id)}>
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Rating */}
                <Rating value={review.rating} readOnly size='small' sx={{ mb: 1 }} />

                {/* Content */}
                <Typography variant='body2' sx={{ mb: 1.5, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {review.content}
                </Typography>

                {/* Medias */}
                {review.medias && review.medias.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {review.medias.map(media => (
                      <Box
                        key={media.id}
                        component='img'
                        src={media.url}
                        onClick={() => window.open(media.url, '_blank')}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid #eee',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                          '&:hover': { opacity: 0.8 }
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Order info */}
                <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
                  {t('ORDER')} #{review.orderId}
                </Typography>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {reviewTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={reviewTotalPages}
                page={reviewPage}
                onChange={(_, newPage) => {
                  setReviewPage(newPage)
                  fetchReviews(selectedProduct.id, newPage)
                }}
                color='primary'
                shape='rounded'
              />
            </Box>
          )}
        </>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{t('confirm_delete_review')}</DialogTitle>
        <DialogContent>
          <Typography>{t('delete_review_confirm_message', { id: deletingId })}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
            {t('cancel')}
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color='inherit' /> : null}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductReviewsPage
