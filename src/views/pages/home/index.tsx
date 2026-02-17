import { Box, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import ProductCard from './componets/CustomCard'
import { ProductType } from 'src/types/product'

interface HomePageProps {
  products: ProductType[]
}

const HomePage = ({ products }: HomePageProps) => {
  return (
    <Box sx={{ py: 4 }}>
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
        <Grid container spacing={2.8}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default HomePage
