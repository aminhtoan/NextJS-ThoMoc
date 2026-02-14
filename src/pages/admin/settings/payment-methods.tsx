import { NextPage } from 'next/types'
import React, { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import PagePaymentMethods from 'src/views/pages/admin/settings/payment-methods'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const Index: NextPageWithLayout = () => {
  return <PagePaymentMethods />
}

Index.getLayout = page => <AdminLayout>{page}</AdminLayout>
Index.permission = 'PAYMENT-METHODS'
export default Index
