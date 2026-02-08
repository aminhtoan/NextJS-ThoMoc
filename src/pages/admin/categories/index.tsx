import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import CategoriesPage from 'src/views/pages/admin/categories'
import UsersPage from 'src/views/pages/admin/users'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageCategories: NextPageWithLayout = () => {
  return <CategoriesPage />
}

PageCategories.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageCategories
