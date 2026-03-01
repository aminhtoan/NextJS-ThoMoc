import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import BrandsPage from 'src/views/pages/admin/brands'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageBrands: NextPageWithLayout = () => {
  return <BrandsPage />
}

PageBrands.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageBrands.permission = 'BRAND'

export default PageBrands
