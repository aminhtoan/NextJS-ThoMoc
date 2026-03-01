import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import ReviewsPage from 'src/views/pages/admin/reviews'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageReviews: NextPageWithLayout = () => {
  return <ReviewsPage />
}

PageReviews.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageReviews.permission = 'REVIEW'

export default PageReviews
