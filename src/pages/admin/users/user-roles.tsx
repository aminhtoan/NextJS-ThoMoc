import { NextPage } from 'next/types'
import { ReactElement } from 'react'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'
import UsersRolePage from 'src/views/pages/admin/users/user-roles'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
  permission?: string
}

const PageUsersRole: NextPageWithLayout = () => {
  return <UsersRolePage />
}

PageUsersRole.getLayout = page => <AdminLayout>{page}</AdminLayout>
PageUsersRole.permission = 'ROLE'
export default PageUsersRole
