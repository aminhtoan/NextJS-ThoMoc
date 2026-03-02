import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ProductReviewsPage from 'src/views/pages/admin/products/reviews'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageProductReviews: NextPageWithLayout = () => {
  return <ProductReviewsPage />
}

PageProductReviews.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageProductReviews.permission = 'REVIEW'

export default PageProductReviews
