import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import ProductForm from 'src/views/pages/admin/products/components/ProductForm'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const AddProductPage: NextPageWithLayout = () => {
  return <ProductForm />
}

AddProductPage.getLayout = page => <SellerLayout>{page}</SellerLayout>
AddProductPage.permission = 'MANAGE-PRODUCT'

export default AddProductPage
