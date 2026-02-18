import { Box } from '@mui/material'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import axios from 'axios'
import ProductDetailView from 'src/views/pages/product/ProductDetailView'

interface ProductDetailPageProps {
  product: any
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const productName = product?.name || 'Chi tiết sản phẩm'

  return (
    <>
      <Head>
        <title>{productName} | Thổ mộc</title>
        <meta name='description' content={productName} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Box sx={{ mx: { xs: 1, md: 6 }, my: 2 }}>
        <ProductDetailView product={product} />
      </Box>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async context => {
  const { productId } = context.params as { productId: string }

  try {
    const response = await axios.get(`https://nestjs-thomoc.onrender.com/api/product/${productId}`)
    const product = response.data ?? null

    return {
      props: {
        product: JSON.parse(JSON.stringify(product))
      }
    }
  } catch (error) {
    console.error('Failed to fetch product detail:', error)

    return {
      notFound: true
    }
  }
}

ProductDetailPage.guestGuard = true
