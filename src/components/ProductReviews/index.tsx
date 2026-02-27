import { Avatar, Box, Chip, Divider, LinearProgress, Pagination, Paper, Rating, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProductReviews, ReviewItem, ReviewListResponse } from 'src/service/review'

const PRIMARY = '#ee4d2d'

interface ProductReviewsProps {
  productId: number
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const fetchReviews = useCallback(
    async (pageNum: number) => {
      setIsLoading(true)
      try {
        const res = await getProductReviews(productId, pageNum, 5)
        const data: ReviewListResponse = res?.data ||
          res?.data || {
            data: [],
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 1
          }

        setReviews(data.data || [])
        setTotalPages(data.totalPages || 1)
        setTotalItems(data.totalItems || 0)
        setPage(data.page || 1)
      } catch (error) {
        console.error('Failed to load reviews:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [productId]
  )

  useEffect(() => {
    if (productId) {
      fetchReviews(1)
    }
  }, [productId, fetchReviews])

  const handlePageChange = (_: any, newPage: number) => {
    fetchReviews(newPage)
  }

  // Calculate rating statistics
  const ratingCounts = [0, 0, 0, 0, 0] // index 0 = 1 star, index 4 = 5 star
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++
    }
  })

  const avgRating = totalItems > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1) : 0

  const filteredReviews = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews

  const hasImageReviews = reviews.filter(r => r.medias && r.medias.length > 0)

  return (
    <Paper sx={{ p: 5, borderRadius: '8px', mb: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#fafafa', p: 2, mb: 3, borderRadius: '2px' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#222', textTransform: 'uppercase' }}>
          {t('product_reviews')}
        </Typography>
      </Box>

      {/* Rating Summary */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          mb: 3,
          p: 3,
          backgroundColor: '#fffbf8',
          border: '1px solid #ffe0cc',
          borderRadius: 1,
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}
      >
        {/* Left: Average */}
        <Box sx={{ textAlign: 'center', minWidth: 150 }}>
          <Typography sx={{ fontSize: '28px', color: PRIMARY, fontWeight: 600 }}>
            {avgRating.toFixed(1)} <span style={{ fontSize: '16px', color: '#555' }}>{t('out of 5')}</span>
          </Typography>
          <Rating value={avgRating} readOnly precision={0.1} size='large' sx={{ color: PRIMARY }} />
        </Box>

        {/* Right: Filter buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={t('ALL')}
            variant={filterRating === null ? 'filled' : 'outlined'}
            onClick={() => setFilterRating(null)}
            sx={{
              borderColor: PRIMARY,
              color: filterRating === null ? '#fff' : PRIMARY,
              backgroundColor: filterRating === null ? PRIMARY : 'transparent',
              '&:hover': { backgroundColor: filterRating === null ? PRIMARY : '#fff5f0' }
            }}
          />
          {[5, 4, 3, 2, 1].map(star => (
            <Chip
              key={star}
              label={`${star} ${t('start')}`}
              variant={filterRating === star ? 'filled' : 'outlined'}
              onClick={() => setFilterRating(filterRating === star ? null : star)}
              sx={{
                borderColor: PRIMARY,
                color: filterRating === star ? '#fff' : PRIMARY,
                backgroundColor: filterRating === star ? PRIMARY : 'transparent',
                '&:hover': { backgroundColor: filterRating === star ? PRIMARY : '#fff5f0' }
              }}
            />
          ))}
          <Chip
            label={` ${t('has_reviews')} (${totalItems})`}
            variant='outlined'
            sx={{ borderColor: PRIMARY, color: PRIMARY }}
          />
          <Chip
            label={` ${t('has_media')} (${hasImageReviews.length})`}
            variant='outlined'
            sx={{ borderColor: PRIMARY, color: PRIMARY }}
          />
        </Box>
      </Box>

      {/* Reviews List */}
      {isLoading ? (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
        </Box>
      ) : filteredReviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontSize: '14px', color: '#999' }}>Chưa có đánh giá nào</Typography>
        </Box>
      ) : (
        <>
          {filteredReviews.map((review, index) => (
            <Box key={review.id}>
              <Box sx={{ display: 'flex', gap: 2, py: 3 }}>
                {/* Avatar */}
                <Avatar src={review.user?.avatar || '/images/default-avatar.png'} sx={{ width: 40, height: 40 }} />

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  {/* Username */}
                  <Typography sx={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
                    {review.user?.name || 'Người dùng'}
                  </Typography>

                  {/* Stars */}
                  <Rating value={review.rating} readOnly size='small' sx={{ color: '#faaf00', my: 0.5 }} />

                  {/* Date */}
                  <Typography sx={{ fontSize: '12px', color: '#999', mb: 1 }}>
                    {new Date(review.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>

                  {/* Review content */}
                  <Typography sx={{ fontSize: '14px', color: '#222', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {review.content}
                  </Typography>

                  {/* Media */}
                  {review.medias && review.medias.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                      {review.medias.map(media => (
                        <Box
                          key={media.id}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 0.5,
                            overflow: 'hidden',
                            border: '1px solid #eee',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 }
                          }}
                        >
                          {media.type === 'VIDEO' ? (
                            <Box
                              component='video'
                              src={media.url}
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
                  )}

                  {/* Update count badge */}
                  {review.updateCount > 0 && (
                    <Typography sx={{ fontSize: '11px', color: '#999', mt: 1, fontStyle: 'italic' }}>
                      (Đã chỉnh sửa)
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < filteredReviews.length - 1 && <Divider />}
            </Box>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' shape='rounded' />
            </Box>
          )}
        </>
      )}
    </Paper>
  )
}

export default ProductReviews
