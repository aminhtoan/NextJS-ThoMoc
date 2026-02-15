import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import PageDeliveryMethods from 'src/views/pages/admin/settings/delivery-method'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const Index: NextPageWithLayout = () => {
  return <PageDeliveryMethods />
}

Index.getLayout = page => <AdminLayout>{page}</AdminLayout>
Index.permission = 'DELIVERY-METHODS'
export default Index
