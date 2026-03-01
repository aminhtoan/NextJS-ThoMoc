import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import CategoriesPage from 'src/views/pages/admin/categories'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageCategories: NextPageWithLayout = () => {
  return <CategoriesPage />
}

PageCategories.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageCategories.permission = 'CATEGORY'

export default PageCategories
