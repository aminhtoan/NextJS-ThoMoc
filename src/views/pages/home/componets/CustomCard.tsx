import { LocalOffer } from '@mui/icons-material'
import { Box, Card, CardContent, Chip, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PLACEHOLDER_IMAGE } from 'src/configs/place_holder'
import { ProductType } from 'src/types/product'

// ============ Styled Components ============
const StyledCard = styled(Card)(() => ({
  borderRadius: 5,
  border: '1px solid #e0e0e0',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-4px)'
  }
}))

const ImageSection = styled(Box)(() => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #eef2f5 100%)',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '5 / 4',
  overflow: 'hidden'
}))

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'relative',
  zIndex: 2
})

interface ThumbnailProps {
  isActive: boolean
}

const Thumbnail = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isActive'
})<ThumbnailProps>(({ isActive }) => ({
  width: 40,
  height: 40,
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
  border: isActive ? '2px solid #ff8c42' : '2px solid transparent',
  transform: isActive ? 'scale(1.05)' : 'scale(1)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
  }
}))

const ThumbnailImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  padding: '2px'
})

const PriceTypography = styled(Typography)({
  fontWeight: 700
})

// ============ Props ============
interface ProductCardProps {
  product: ProductType
}

// ============ Component ============
const ProductCard = ({ product }: ProductCardProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const router = useRouter()

  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE]
  const currentImage = images[activeImageIndex] || images[0]

  const hasDiscount = product.virtualPrice > product.basePrice
  const discountPercentage = hasDiscount
    ? Math.round(((product.virtualPrice - product.basePrice) / product.virtualPrice) * 100)
    : 0

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      {/* Image Section */}
      <ImageSection>
        {hasDiscount && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            <Chip
              size='small'
              icon={<LocalOffer sx={{ fontSize: '14px !important' }} />}
              label={`-${discountPercentage}%`}
              sx={{
                backgroundColor: '#ff8c42',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                height: 24,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        )}

        <ProductImage src={currentImage} alt={product.name} />
      </ImageSection>

      {/* Image Thumbnails (only if multiple images) */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 0.6,
            px: 1.5,
            pt: 1.2,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {images.slice(0, 3).map((img, index) => (
            <Thumbnail
              key={index}
              isActive={activeImageIndex === index}
              onClick={() => setActiveImageIndex(index)}
              elevation={0}
              role='button'
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter') setActiveImageIndex(index)
              }}
            >
              <ThumbnailImage src={img} alt={`${product.name} ${index + 1}`} />
            </Thumbnail>
          ))}
          {images.length > 3 && (
            <Paper
              sx={{
                width: 40,
                height: 40,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff5f0',
                border: '1px solid #ff8c42',
                flexShrink: 0,
                fontSize: '12px',
                fontWeight: 700,
                color: '#ff8c42',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              +{images.length - 3}
            </Paper>
          )}
        </Box>
      )}

      {/* Content Section */}
      <CardContent
        sx={{
          p: 2,
          pt: images.length > 1 ? 1.2 : 1.5,
          pb: 1.5,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Product Name */}
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1.2,
            letterSpacing: '-0.3px',
            fontSize: '14px',
            lineHeight: 1.4,
            height: '40px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </Typography>

        {/* Price Section */}
        <Box
          sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5, minHeight: '24px' }}
        >
          <PriceTypography sx={{ fontSize: '16px', color: '#1a1a1a' }}>
            ${product.basePrice.toLocaleString()}
          </PriceTypography>
          {hasDiscount && (
            <Typography
              sx={{
                fontSize: '11px',
                color: '#999',
                textDecoration: 'line-through',
                fontWeight: 500
              }}
            >
              ${product.virtualPrice.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
      </CardContent>
    </StyledCard>
  )
}

export default ProductCard
