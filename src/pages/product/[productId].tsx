import { Box } from '@mui/material'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import axios from 'axios'
import ProductDetailView from 'src/views/pages/product/ProductDetailView'

interface ProductDetailPageProps {
  product: any
  defaultLanguage: string
}

// Hardcode URL để sure nó work
const API_BASE_URL_ENV = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductDetailPage = ({ product, defaultLanguage }: ProductDetailPageProps) => {
  const productName = product?.name || 'Chi tiết sản phẩm'

  return (
    <>
      <Head>
        <title>{productName} | Thổ mộc</title>
        <meta name='description' content={productName} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Box sx={{ mx: { xs: 1, md: 6 }, my: 2 }}>
        <ProductDetailView product={product} defaultLanguage={defaultLanguage} />
      </Box>
    </>
  )
}
export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async context => {
  const { productId } = context.params as { productId: string }
  const cookieLang = context.req.cookies['i18nextLng']
  const browserLang = (context.req.headers['accept-language'] || 'vi').split('-')[0].split(',')[0].toLowerCase()
  const baseLang = cookieLang || browserLang

  try {
    const response = await axios.get(`${API_BASE_URL_ENV}/product/${productId}`, {
      headers: { 'Accept-Language': baseLang }
    })
    const product = response.data ?? null

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        defaultLanguage: baseLang
      }
    }
  } catch (error) {
    console.error('[SSR Product] Error fetching product:', error)

    return { notFound: true }
  }
}

ProductDetailPage.guestGuard = false
ProductDetailPage.authGuard = false
export default ProductDetailPage
