import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import BrandsPage from 'src/views/pages/admin/brands'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageBrands: NextPageWithLayout = () => {
  return <BrandsPage />
}

PageBrands.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageBrands
