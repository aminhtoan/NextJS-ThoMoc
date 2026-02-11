import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ProductsPage from 'src/views/pages/admin/products'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageProducts: NextPageWithLayout = () => {
  return <ProductsPage />
}

PageProducts.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageProducts.permission = 'MANAGE-PRODUCT'

export default PageProducts
