import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'
import PrivacySettings from 'src/views/pages/my-profile/privacy-settings'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const Index: NexpageWithLayout = () => {
  return <PrivacySettings />
}

Index.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default Index
