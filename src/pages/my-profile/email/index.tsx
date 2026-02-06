import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'
import EmailPage from 'src/views/pages/my-profile/email'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const Email: NexpageWithLayout = () => {
  return <EmailPage />
}

Email.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default Email
