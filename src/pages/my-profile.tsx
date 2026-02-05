import { NextPage } from 'next'
import BlankLayout from 'src/views/layouts/BlankLayout'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import PageMyProfile from 'src/views/pages/my-profile'
type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <PageMyProfile />
}

// MyProfile.getLayout = page => <LayoutNotApp>{page}</LayoutNotApp>
export default MyProfile
