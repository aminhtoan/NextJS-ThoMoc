import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

interface ReviewMedia {
  id: number
  url: string
}

interface ReviewUser {
  id: number
  name: string
  avatar: string
}

interface ReviewProduct {
  id: number
  name: string
  images: string[]
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
  product: ReviewProduct
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

const RATING_COLORS: Record<number, string> = {
  1: '#f44336',
  2: '#ff9800',
  3: '#ffc107',
  4: '#8bc34a',
  5: '#4caf50'
}

const ReviewsPage: NextPage = () => {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | ''>('')
  const [stats, setStats] = useState<ReviewStats | null>(null)

  const debouncedSearch = useDebounce(searchValue, 500)

  const fetchReviews = useCallback(
    async (pageNum: number, search?: string, rating?: number | '') => {
      setIsLoading(true)
      try {
        let url = `${API_CONFIG.REVIEW.REVIEW}/admin/all?page=${pageNum}&limit=10`
        if (search) url += `&search=${encodeURIComponent(search)}`
        if (rating) url += `&rating=${rating}`
        const res = await handleAPI(url)
        setReviews(res?.data?.data || [])
        setTotalPages(res?.data?.totalPages || 1)
        setTotalItems(res?.data?.totalItems || 0)
        setPage(pageNum)
      } catch (error) {
        console.error('Failed to load reviews:', error)
        toast.error(t('load_reviews_failed'))
      } finally {
        setIsLoading(false)
      }
    },
    [t]
  )

  const fetchStats = useCallback(async () => {
    try {
      const res = await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/admin/stats`)
      setStats(res?.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchReviews(1, debouncedSearch, ratingFilter)
  }, [debouncedSearch, ratingFilter, fetchReviews])

  const handlePageChange = (_: any, newPage: number) => {
    fetchReviews(newPage, debouncedSearch, ratingFilter)
  }

  const handleViewDetail = (review: ReviewItem) => {
    setSelectedReview(review)
    setDetailOpen(true)
  }

  const handleDeleteClick = (reviewId: number) => {
    setDeletingId(reviewId)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/admin/${deletingId}`, {}, 'delete')
      toast.success(t('delete_review_success'))
      setDeleteConfirmOpen(false)
      setDeletingId(null)
      fetchReviews(page, debouncedSearch, ratingFilter)
      fetchStats()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('delete_review_error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const maxRatingCount = stats ? Math.max(...Object.values(stats.ratingDistribution), 1) : 1

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
        {t('manage_product_reviews')}
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1 }}>{t('total_reviews')}</Typography>
                <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#1677ff' }}>
                  {stats.totalReviews}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1 }}>{t('average_rating')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#ff9800' }}>
                    {stats.averageRating}
                  </Typography>
                  <StarIcon sx={{ color: '#ff9800', fontSize: '28px' }} />
                </Box>
                <Rating value={stats.averageRating} readOnly precision={0.1} size='small' sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1.5 }}>{t('rating_distribution')}</Typography>
                {[5, 4, 3, 2, 1].map(star => {
                  const count = stats.ratingDistribution[star.toString() as keyof typeof stats.ratingDistribution]
                  const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0

                  return (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: '14px' }}>{star}</Typography>
                      <StarIcon sx={{ color: RATING_COLORS[star], fontSize: '14px' }} />
                      <LinearProgress
                        variant='determinate'
                        value={(count / maxRatingCount) * 100}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: RATING_COLORS[star],
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography sx={{ fontSize: '11px', color: '#888', minWidth: '45px', textAlign: 'right' }}>
                        {count} ({percent}%)
                      </Typography>
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size='small'
            placeholder={t('search_reviews_placeholder') || 'Tìm theo nội dung, tên user, tên sản phẩm, ID...'}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            sx={{ flex: 1, minWidth: '250px' }}
          />
          <FormControl size='small' sx={{ minWidth: '150px' }}>
            <InputLabel>{t('rating')}</InputLabel>
            <Select
              value={ratingFilter}
              label={t('rating')}
              onChange={e => setRatingFilter(e.target.value as number | '')}
            >
              <MenuItem value=''>
                <em>{t('all')}</em>
              </MenuItem>
              {[5, 4, 3, 2, 1].map(r => (
                <MenuItem key={r} value={r}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {r} <StarIcon sx={{ color: RATING_COLORS[r], fontSize: '16px' }} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('product')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('reviewer')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('rating')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('review_content')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('images')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('created_at')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('status')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: '#999' }}>{t('no_reviews_found')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map(review => (
                  <TableRow key={review.id} hover>
                    <TableCell sx={{ fontSize: '13px' }}>#{review.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 220 }}>
                        {review.product?.images?.[0] ? (
                          <Box
                            component='img'
                            src={review.product.images[0]}
                            sx={{
                              width: 36,
                              height: 36,
                              objectFit: 'cover',
                              borderRadius: 0.5,
                              border: '1px solid #eee',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: '#f0f0f0',
                              borderRadius: 0.5,
                              flexShrink: 0
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {review.product?.name || `Product #${review.productId}`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={review.user?.avatar || '/images/default-avatar.png'}
                          sx={{ width: 28, height: 28 }}
                        />
                        <Typography sx={{ fontSize: '12px' }}>{review.user?.name || 'N/A'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={review.rating} readOnly size='small' />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: RATING_COLORS[review.rating] }}>
                          {review.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {review.content}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {review.medias?.slice(0, 2).map(media => (
                          <Box
                            key={media.id}
                            component='img'
                            src={media.url}
                            sx={{
                              width: 32,
                              height: 32,
                              objectFit: 'cover',
                              borderRadius: 0.5,
                              border: '1px solid #eee'
                            }}
                          />
                        ))}
                        {review.medias?.length > 2 && (
                          <Chip label={`+${review.medias.length - 2}`} size='small' sx={{ height: 32 }} />
                        )}
                        {(!review.medias || review.medias.length === 0) && (
                          <Typography sx={{ fontSize: '11px', color: '#ccc' }}>--</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', color: '#888' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={review.updateCount > 0 ? t('edited') || 'Đã sửa' : t('original') || 'Gốc'}
                        size='small'
                        color={review.updateCount > 0 ? 'warning' : 'success'}
                        variant='outlined'
                        sx={{ fontSize: '11px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title={t('view_details')}>
                        <IconButton size='small' onClick={() => handleViewDetail(review)} color='primary'>
                          <VisibilityIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('delete_review')}>
                        <IconButton size='small' onClick={() => handleDeleteClick(review.id)} color='error'>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: '12px', color: '#888' }}>
              {t('showing_results', { count: totalItems }) || `Tổng ${totalItems} đánh giá`}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' shape='rounded' />
          </Box>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('review_detail')} #{selectedReview?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <Grid container spacing={3}>
              {/* Left: Product info */}
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1, fontWeight: 600 }}>{t('product')}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {selectedReview.product?.images?.[0] && (
                    <Box
                      component='img'
                      src={selectedReview.product.images[0]}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid #eee' }}
                    />
                  )}
                  <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedReview.product?.name || `Product #${selectedReview.productId}`}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>
                      ID: {selectedReview.productId} | Order: #{selectedReview.orderId}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1, fontWeight: 600 }}>
                  {t('reviewer')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar
                    src={selectedReview.user?.avatar || '/images/default-avatar.png'}
                    sx={{ width: 44, height: 44 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{selectedReview.user?.name}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>User ID: {selectedReview.userId}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>{t('created_at')}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>{t('updated_at')}</Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      {new Date(selectedReview.updatedAt).toLocaleString('vi-VN')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right: Review content */}
              <Grid item xs={12} md={7}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1, fontWeight: 600 }}>{t('rating')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={selectedReview.rating} readOnly size='large' />
                  <Typography sx={{ fontSize: '20px', fontWeight: 700, color: RATING_COLORS[selectedReview.rating] }}>
                    {selectedReview.rating}/5
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '13px', color: '#888', mb: 1, fontWeight: 600 }}>
                  {t('review_content')}
                </Typography>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}>
                  <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {selectedReview.content}
                  </Typography>
                </Paper>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    label={
                      selectedReview.updateCount > 0
                        ? `${t('edited') || 'Đã chỉnh sửa'} (${selectedReview.updateCount}/1)`
                        : t('original') || 'Bài viết gốc'
                    }
                    size='small'
                    color={selectedReview.updateCount > 0 ? 'warning' : 'success'}
                    variant='outlined'
                  />
                </Box>

                {selectedReview.medias && selectedReview.medias.length > 0 && (
                  <Box>
                    <Typography sx={{ fontSize: '13px', color: '#888', mb: 1, fontWeight: 600 }}>
                      {t('media')} ({selectedReview.medias.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedReview.medias.map(media => (
                        <Box
                          key={media.id}
                          component='img'
                          src={media.url}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #eee',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                          onClick={() => window.open(media.url, '_blank')}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>{t('close')}</Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              if (selectedReview) {
                setDetailOpen(false)
                handleDeleteClick(selectedReview.id)
              }
            }}
            startIcon={<DeleteIcon />}
          >
            {t('delete_review')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{t('confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('are_you_sure_delete_review', { id: deletingId }) || `Bạn có chắc muốn xóa đánh giá #${deletingId}?`}
          </Typography>
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
            startIcon={isDeleting ? <CircularProgress size={16} color='inherit' /> : <DeleteIcon />}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ReviewsPage
