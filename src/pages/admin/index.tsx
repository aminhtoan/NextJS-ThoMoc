import { NextPage } from 'next'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import PageAdmin from 'src/views/pages/admin'

const AdminPage: NextPage = () => {
  return <PageAdmin />
}

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default AdminPage

// useEffect(() => {
//   if (!loading && !user?.role?.name?.toLowerCase().includes('admin')) {
//     router.replace('/')
//   }
// }, [loading, user, router])

// if (loading) {
//   return <Spinner />
// }

// if (!user?.role?.name?.toLowerCase().includes('admin')) {
//   return null
// }
