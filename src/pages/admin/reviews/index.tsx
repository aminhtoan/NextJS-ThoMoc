import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ReviewsPage from 'src/views/pages/admin/reviews'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageReviews: NextPageWithLayout = () => {
  return <ReviewsPage />
}

PageReviews.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageReviews
