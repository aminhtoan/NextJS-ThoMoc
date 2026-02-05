import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import OrdersPage from 'src/views/pages/admin/orders'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageOrder: NextPageWithLayout = () => {
  return <OrdersPage />
}

PageOrder.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageOrder
