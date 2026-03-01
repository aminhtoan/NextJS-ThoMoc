import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import OrdersPage from 'src/views/pages/admin/orders'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageOrder: NextPageWithLayout = () => {
  return <OrdersPage />
}

PageOrder.getLayout = page => <SellerLayout>{page}</SellerLayout>
PageOrder.permission = 'ORDER'

export default PageOrder
