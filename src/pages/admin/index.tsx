import { NextPage } from 'next'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import PageAdmin from 'src/views/pages/admin'

const AdminPage: NextPage = () => {
  return <PageAdmin />
}

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default AdminPage
