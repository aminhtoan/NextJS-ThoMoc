import { NextPage } from 'next/types'
import PageMyProfile from 'src/views/pages/my-profile'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <PageMyProfile />
}

// MyProfile.getLayout = page => <LayoutNotApp>{page}</LayoutNotApp>
export default MyProfile
