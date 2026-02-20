import { Box, Paper, Typography, IconButton } from '@mui/material'
import { CategoryWithTranslationsType } from 'src/types/category'
import Image from 'next/image'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useState } from 'react'

interface CategoryGridProps {
  categories: CategoryWithTranslationsType[]
  onCategoryClick: (categoryId: number) => void
}

const ITEMS_PER_ROW = 10
const ROWS = 2
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS // 20

const CategoryGrid = ({ categories, onCategoryClick }: CategoryGridProps) => {
  const [startIndex, setStartIndex] = useState(0)

  const parentCategories = categories.filter(cat => !cat.parentCategoryId)
  const visibleCategories = parentCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const hasNext = startIndex + ITEMS_PER_PAGE < parentCategories.length
  const hasPrev = startIndex > 0

  const handleNext = () => {
    if (hasNext) setStartIndex(prev => prev + ITEMS_PER_PAGE)
  }

  const handlePrev = () => {
    if (hasPrev) setStartIndex(prev => prev - ITEMS_PER_PAGE)
  }

  if (parentCategories.length === 0) return null

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#333',
          mb: 2,
          textTransform: 'uppercase'
        }}
      >
        DANH MỤC
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Nút prev */}
        <IconButton
          onClick={handlePrev}
          disabled={!hasPrev}
          size='small'
          sx={{
            flexShrink: 0,
            backgroundColor: '#f5f5f5',
            visibility: hasPrev ? 'visible' : 'hidden',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Grid category */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)', // Luôn 10 cột
            gridTemplateRows: 'auto auto', // 2 hàng
            gap: 1
          }}
        >
          {visibleCategories.map(category => {
            const translationName =
              category.categoryTranslations && category.categoryTranslations.length > 0
                ? category.categoryTranslations[0].name
                : category.name

            return (
              <Box
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.06)',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {/* Ảnh category */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    flexShrink: 0
                  }}
                >
                  {category.logo ? (
                    <Image
                      src={category.logo}
                      alt={translationName || 'category'}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 700
                      }}
                    >
                      {translationName?.charAt(0).toUpperCase() || 'C'}
                    </Box>
                  )}
                </Box>

                {/* Tên category */}
                <Typography
                  sx={{
                    fontSize: '12px',
                    textAlign: 'center',
                    color: '#333',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    width: '100%'
                  }}
                >
                  {translationName}
                </Typography>
              </Box>
            )
          })}
        </Box>

        {/* Nút next */}
        <IconButton
          onClick={handleNext}
          disabled={!hasNext}
          size='small'
          sx={{
            flexShrink: 0,
            backgroundColor: '#f5f5f5',
            visibility: hasNext ? 'visible' : 'hidden',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default CategoryGrid
