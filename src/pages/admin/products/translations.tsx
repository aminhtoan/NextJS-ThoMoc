import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ProductTranslationsPage from 'src/views/pages/admin/products/ProductTranslationsPage'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageProductTranslations: NextPageWithLayout = () => {
  return <ProductTranslationsPage />
}

PageProductTranslations.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageProductTranslations.permission = ''

export default PageProductTranslations
