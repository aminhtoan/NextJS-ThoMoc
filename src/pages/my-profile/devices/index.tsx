import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'
import DevicesPage from 'src/views/pages/my-profile/devices'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const Index: NexpageWithLayout = () => {
  return <DevicesPage />
}

Index.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default Index
