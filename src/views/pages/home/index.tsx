import { Box, Grid, Paper, Pagination, Typography } from '@mui/material'
import React from 'react'
import ProductCard from './componets/CustomCard'
import CategoryGrid from './componets/CategoryGrid'
import { ProductType } from 'src/types/product'
import { CategoryWithTranslationsType } from 'src/types/category'

interface HomePageProps {
  products: ProductType[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  categories: CategoryWithTranslationsType[]
  onCategoryClick: (categoryId: number) => void
}

const HomePage = ({ products, totalPages, currentPage, onPageChange, categories, onCategoryClick }: HomePageProps) => {
  return (
    <Box sx={{ py: 4 }}>
      {/* Category Grid */}
      <CategoryGrid categories={categories} onCategoryClick={onCategoryClick} />
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: '3px solid #1976d2',
          textAlign: 'center',
          borderRadius: 0
        }}
      >
        <Paper
          sx={{
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none'
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1976d2',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            GỢI Ý HÔM NAY
          </Typography>
        </Paper>
      </Box>

      {products.length === 0 ? (
        <Typography variant='body1' sx={{ color: '#999', textAlign: 'center', py: 8 }}>
          Không có sản phẩm nào.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2.8}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => onPageChange(page)}
              color='primary'
              shape='rounded'
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '14px',
                  color: '#1976d2'
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: '#fff'
                }
              }}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default HomePage
