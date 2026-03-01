import { useRouter } from 'next/router'
import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import ProductForm from 'src/views/pages/admin/products/components/ProductForm'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const EditProductPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query
  const productId = id ? Number(id) : undefined

  if (!productId) return null

  return <ProductForm productId={productId} />
}

EditProductPage.getLayout = page => <SellerLayout>{page}</SellerLayout>
EditProductPage.permission = 'MANAGE-PRODUCT'

export default EditProductPage
