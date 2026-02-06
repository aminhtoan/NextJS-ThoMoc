import { NextPage } from 'next/types'
import { ReactNode } from 'react'
import MyProfileLayout from 'src/views/layouts/MyProfile/MyProfileLayout'
import PageMyProfile from 'src/views/pages/my-profile'

type TProps = {}

const MyProfile: NextPage<TProps> & { getLayout?: (page: ReactNode) => ReactNode } = () => {
  return <PageMyProfile />
}

MyProfile.getLayout = page => <MyProfileLayout>{page}</MyProfileLayout>

export default MyProfile
