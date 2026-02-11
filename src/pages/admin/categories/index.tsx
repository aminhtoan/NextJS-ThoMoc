import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import CategoriesPage from 'src/views/pages/admin/categories'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageCategories: NextPageWithLayout = () => {
  return <CategoriesPage />
}

PageCategories.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageCategories.permission = 'CATEGORY'

export default PageCategories
