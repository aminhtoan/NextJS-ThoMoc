import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import ProductsPage from 'src/views/pages/admin/products'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageProducts: NextPageWithLayout = () => {
  return <ProductsPage />
}

PageProducts.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageProducts.permission = 'MANAGE-PRODUCT'

export default PageProducts
