import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
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

EditProductPage.getLayout = page => <AdminLayout>{page}</AdminLayout>
EditProductPage.permission = 'MANAGE-PRODUCT'

export default EditProductPage
