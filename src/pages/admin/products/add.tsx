import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import ProductForm from 'src/views/pages/admin/products/components/ProductForm'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const AddProductPage: NextPageWithLayout = () => {
  return <ProductForm />
}

AddProductPage.getLayout = page => <AdminLayout>{page}</AdminLayout>
AddProductPage.permission = 'MANAGE-PRODUCT'

export default AddProductPage
