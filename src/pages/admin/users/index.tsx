import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import UsersPage from 'src/views/pages/admin/users'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageUsers: NextPageWithLayout = () => {
  return <UsersPage />
}

PageUsers.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageUsers.permission = 'PROFILE'

export default PageUsers
