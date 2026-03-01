import { NextPage } from 'next'
import SellerLayout from 'src/views/layouts/SellerLayout/SellerLayout'
import PageSeller from 'src/views/pages/seller'

const SellerPage: NextPage = () => {
  return <PageSeller />
}

SellerPage.getLayout = page => <SellerLayout>{page}</SellerLayout>

export default SellerPage
