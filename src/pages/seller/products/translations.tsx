import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import ProductTranslationsPage from 'src/views/pages/admin/products/ProductTranslationsPage'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageProductTranslations: NextPageWithLayout = () => {
  return <ProductTranslationsPage />
}

PageProductTranslations.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageProductTranslations.permission = ''

export default PageProductTranslations
