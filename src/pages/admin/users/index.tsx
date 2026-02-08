import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import UsersPage from 'src/views/pages/admin/users'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageUsers: NextPageWithLayout = () => {
  return <UsersPage />
}

PageUsers.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageUsers
