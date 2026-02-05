import { NextPage } from 'next'
import BlankLayout from 'src/views/layouts/BlankLayout'
import PageLogin from 'src/views/pages/login'

type TProps = {}

const Login: NextPage<TProps> = () => {
  return <PageLogin />
}

export default Login

Login.getLayout = page => <BlankLayout>{page}</BlankLayout>
Login.guestGuard = true
