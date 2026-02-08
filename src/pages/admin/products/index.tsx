import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ProductsPage from 'src/views/pages/admin/products'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageProducts: NextPageWithLayout = () => {
  return <ProductsPage />
}

PageProducts.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageProducts
