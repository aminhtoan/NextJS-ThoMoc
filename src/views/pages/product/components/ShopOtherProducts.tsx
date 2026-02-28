import ProductCard from '../../home/componets/CustomCard'
import { Box, Typography } from '@mui/material'
import { getPublicProducts } from 'src/service/product'
import { useEffect, useState } from 'react'

interface ShopOtherProductsProps {
  shopId: number
}

const ShopOtherProducts = ({ shopId }: ShopOtherProductsProps) => {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getPublicProducts({
          page: 1,
          limit: 5,
          brandIds: shopId,
          orderBy: 'desc',
          sortBy: 'createdAt'
        })
        setProducts(res.data.data || [])
      } catch (err) {
        setProducts([])
      }
    }
    fetchProducts()
  }, [shopId])

  if (!products.length) return null

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Sản phẩm khác của shop
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', overflowX: 'auto' }}>
        {products.map(product => (
          <Box key={product.id} sx={{ minWidth: 220, maxWidth: 250, flex: '0 0 auto' }}>
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ShopOtherProducts
