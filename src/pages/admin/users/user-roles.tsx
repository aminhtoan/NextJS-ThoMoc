import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import UsersRolePage from 'src/views/pages/admin/users/user-roles'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}

const PageUsers: NextPageWithLayout = () => {
  return <UsersRolePage />
}

PageUsers.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default PageUsers
