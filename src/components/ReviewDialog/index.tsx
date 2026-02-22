import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  TextField,
  Typography
} from '@mui/material'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { uploadMedia } from 'src/service/media'
import {
  CreateReviewBody,
  ReviewItem,
  ReviewMedia,
  ReviewMediaWithId,
  UpdateReviewBody,
  createReview,
  updateReview
} from 'src/service/review'

const RATING_LABELS: Record<number, string> = {
  1: 'Tệ',
  2: 'Không hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Tuyệt vời'
}

interface ReviewDialogProps {
  open: boolean
  onClose: () => void
  orderId: number
  productId: number
  productName: string
  productImage: string
  skuValue?: string
  existingReview?: ReviewItem | null
  onSuccess?: () => void
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onClose,
  orderId,
  productId,
  productName,
  productImage,
  skuValue,
  existingReview,
  onSuccess
}) => {
  //   const { t } = useTranslation()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(-1)
  const [content, setContent] = useState('')
  const [medias, setMedias] = useState<(ReviewMedia & { preview?: string })[]>([])
  const [existingMedias, setExistingMedias] = useState<ReviewMediaWithId[]>([])
  const [removeMediaIds, setRemoveMediaIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [canEdit, setCanEdit] = useState(true)

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setContent(existingReview.content)
      setExistingMedias(existingReview.medias || [])
      setIsEditing(true)
      setCanEdit(existingReview.updateCount < 1)
    } else {
      setRating(5)
      setContent('')
      setMedias([])
      setExistingMedias([])
      setRemoveMediaIds([])
      setIsEditing(false)
      setCanEdit(true)
    }
  }, [existingReview, open])

  const handleUploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const res = await uploadMedia(file, 'reviews')
        const url = res?.data?.data?.url || res?.data?.url
        if (url) {
          const type = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
          setMedias(prev => [...prev, { url, type, preview: URL.createObjectURL(file) }])
        }
      }
    } catch (error) {
      toast.error('Upload ảnh thất bại')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleRemoveNewMedia = (index: number) => {
    setMedias(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingMedia = (mediaId: number) => {
    setRemoveMediaIds(prev => [...prev, mediaId])
    setExistingMedias(prev => prev.filter(m => m.id !== mediaId))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá')

      return
    }
    if (rating < 1) {
      toast.error('Vui lòng chọn số sao')

      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing && existingReview) {
        // Update
        const body: UpdateReviewBody = {
          content,
          rating,
          medias: {
            add: medias.map(m => ({ url: m.url, type: m.type })),
            removeIds: removeMediaIds.length > 0 ? removeMediaIds : undefined
          }
        }
        await updateReview(existingReview.id, body)
        toast.success('Cập nhật đánh giá thành công')
      } else {
        // Create
        const body: CreateReviewBody = {
          content,
          rating,
          orderId,
          productId,
          medias: medias.map(m => ({ url: m.url, type: m.type }))
        }
        await createReview(body)
        toast.success('Đánh giá sản phẩm thành công')
      }
      onSuccess?.()
      onClose()
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoverRating !== -1 ? hoverRating : rating

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
          {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
        </Typography>
        <IconButton onClick={onClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Product info */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 1.5, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              position: 'relative',
              flexShrink: 0,
              borderRadius: 0.5,
              overflow: 'hidden',
              border: '1px solid #eee'
            }}
          >
            <Image
              src={productImage || '/images/placeholder.png'}
              alt={productName}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, lineClamp: 2 }}>{productName}</Typography>
            {skuValue && (
              <Typography sx={{ fontSize: '12px', color: '#888', mt: 0.5 }}>Phân loại: {skuValue}</Typography>
            )}
          </Box>
        </Box>

        {isEditing && !canEdit && (
          <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#fff3cd', borderRadius: 1, border: '1px solid #ffc107' }}>
            <Typography sx={{ fontSize: '13px', color: '#856404' }}>
              Bạn đã chỉnh sửa đánh giá 1 lần. Không thể chỉnh sửa thêm.
            </Typography>
          </Box>
        )}

        {/* Rating */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: '#555', mb: 1 }}>Chất lượng sản phẩm</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Rating
              value={rating}
              onChange={(_, newValue) => {
                if (canEdit && newValue) setRating(newValue)
              }}
              onChangeActive={(_, newHover) => setHoverRating(newHover)}
              size='large'
              readOnly={!canEdit}
              emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize='inherit' />}
              sx={{
                fontSize: '36px',
                '& .MuiRating-iconFilled': { color: '#faaf00' }
              }}
            />
            <Typography sx={{ fontSize: '14px', color: '#ee4d2d', fontWeight: 500, minWidth: 100 }}>
              {RATING_LABELS[displayRating] || ''}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder='Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!'
          value={content}
          onChange={e => canEdit && setContent(e.target.value)}
          disabled={!canEdit}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              fontSize: '14px'
            }
          }}
        />

        {/* Existing medias */}
        {existingMedias.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#555', mb: 1 }}>Ảnh/Video đã tải lên:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {existingMedias.map(media => (
                <Box key={media.id} sx={{ position: 'relative', width: 80, height: 80 }}>
                  <Box
                    component='img'
                    src={media.url}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #eee'
                    }}
                  />
                  {canEdit && (
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveExistingMedia(media.id)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                        width: 24,
                        height: 24
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* New medias */}
        {medias.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#555', mb: 1 }}>Ảnh mới:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {medias.map((media, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: 80, height: 80 }}>
                  <Box
                    component='img'
                    src={media.preview || media.url}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #eee'
                    }}
                  />
                  <IconButton
                    size='small'
                    onClick={() => handleRemoveNewMedia(idx)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                      width: 24,
                      height: 24
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Upload button */}
        {canEdit && (
          <Button
            component='label'
            variant='outlined'
            startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            disabled={isUploading}
            sx={{ fontSize: '13px', textTransform: 'none' }}
          >
            {isUploading ? 'Đang tải...' : 'Thêm Hình ảnh / Video'}
            <input type='file' hidden multiple accept='image/*,video/*' onChange={handleUploadImage} />
          </Button>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Hủy
        </Button>
        {canEdit && (
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            startIcon={isSubmitting ? <CircularProgress size={16} color='inherit' /> : null}
            sx={{
              textTransform: 'none',
              backgroundColor: '#ee4d2d',
              '&:hover': { backgroundColor: '#d73211' }
            }}
          >
            {isEditing ? 'Cập nhật' : 'Gửi đánh giá'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ReviewDialog
