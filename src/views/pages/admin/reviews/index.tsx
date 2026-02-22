import DeleteIcon from '@mui/icons-material/Delete'
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
  IconButton,
  Pagination,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { NextPage } from 'next/types'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

interface ReviewMedia {
  id: number
  url: string
  type: 'IMAGE' | 'VIDEO'
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

const PRIMARY = '#1677ff'

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

  const fetchReviews = useCallback(async (pageNum: number) => {
    setIsLoading(true)
    try {
      const res = await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/admin/all?page=${pageNum}&limit=10`)
      const data = res?.data?.data || res?.data
      setReviews(data || [])
      setTotalPages(res.data.totalPages || 1)
      setTotalItems(res.data.totalItems || 0)
      setPage(data?.page || pageNum)
    } catch (error) {
      console.error('Failed to load reviews:', error)
      toast.error(t('load_reviews_failed'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews(1)
  }, [fetchReviews])

  const handlePageChange = (_: any, newPage: number) => {
    fetchReviews(newPage)
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
      fetchReviews(page)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('delete_review_error'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
        {t('manage_product_reviews')}
      </Typography>

      {/* Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('total_reviews')}</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: PRIMARY }}>{totalItems}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('reviewer')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('rating')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('review_content')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('product_id')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('order_id')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('images')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('created_at')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{t('updated_at')}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: '#999' }}>{t('no_reviews_found')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map(review => (
                  <TableRow key={review.id} hover>
                    <TableCell sx={{ fontSize: '13px' }}>#{review.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={review.user?.avatar || '/images/default-avatar.png'}
                          sx={{ width: 30, height: 30 }}
                        />
                        <Typography sx={{ fontSize: '13px' }}>{review.user?.name || 'N/A'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly size='small' />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {review.content}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>{review.productId}</TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>{review.orderId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {review.medias?.slice(0, 2).map(media => (
                          <Box
                            key={media.id}
                            component='img'
                            src={media.url}
                            sx={{
                              width: 36,
                              height: 36,
                              objectFit: 'cover',
                              borderRadius: 0.5,
                              border: '1px solid #eee'
                            }}
                          />
                        ))}
                        {review.medias?.length > 2 && (
                          <Chip label={`+${review.medias.length - 2}`} size='small' sx={{ height: 36 }} />
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
                        label={review.updateCount > 0 ? 'Đã sửa' : 'Chưa sửa'}
                        size='small'
                        color={review.updateCount > 0 ? 'warning' : 'default'}
                        variant='outlined'
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' shape='rounded' />
          </Box>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('review_detail')} #{selectedReview?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <Box>
              {/* User info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={selectedReview.user?.avatar || '/images/default-avatar.png'}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{selectedReview.user?.name}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#888' }}>User ID: {selectedReview.userId}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Rating */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 0.5 }}>{t('rating')}</Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>

              {/* Content */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#888', mb: 0.5 }}>{t('review_content')}</Typography>
                <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{selectedReview.content}</Typography>
              </Box>

              {/* Info */}
              <Box sx={{ mb: 2, display: 'flex', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('product_id')}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{selectedReview.productId}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('order_id')}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{selectedReview.orderId}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('update_count')}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{selectedReview.updateCount}/1</Typography>
                </Box>
              </Box>

              {/* Dates */}
              <Box sx={{ mb: 2, display: 'flex', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('created_at')}</Typography>
                  <Typography sx={{ fontSize: '13px' }}>
                    {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888' }}>{t('updated_at')}</Typography>
                  <Typography sx={{ fontSize: '13px' }}>
                    {new Date(selectedReview.updatedAt).toLocaleString('vi-VN')}
                  </Typography>
                </Box>
              </Box>

              {/* Medias */}
              {selectedReview.medias && selectedReview.medias.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#888', mb: 1 }}>
                    {t('media_count', { count: selectedReview.medias.length })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedReview.medias.map(media => (
                      <Box
                        key={media.id}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '1px solid #eee'
                        }}
                      >
                        {media.type === 'VIDEO' ? (
                          <Box
                            component='video'
                            src={media.url}
                            controls
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            component='img'
                            src={media.url}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
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
          >
            {t('delete_review')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{t('confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('are_you_sure_delete_review', { id: deletingId })}</Typography>
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

export default ReviewsPage
