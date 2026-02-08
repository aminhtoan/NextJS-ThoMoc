import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'
import ChangePasswordPage from 'src/views/pages/my-profile/change-password'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const ChangepPassword: NexpageWithLayout = () => {
  return <ChangePasswordPage />
}

ChangepPassword.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default ChangepPassword
