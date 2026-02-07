import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const ChangepPassword: NexpageWithLayout = () => {
  return <div>Changpassowrd</div>
}

ChangepPassword.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default ChangepPassword
