import { NextPage } from 'next/types'
import React from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'

type NexpageWithLayout = NextPage & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const Address: NexpageWithLayout = () => {
  return <div>Thêm sau</div>
}

Address.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>
export default Address
