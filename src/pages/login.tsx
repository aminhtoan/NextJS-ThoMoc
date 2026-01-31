import { NextPage } from 'next'
import BlankLayout from 'src/views/layouts/BlankLayout'
import PageLogin from 'src/views/pages/login'

type TProps = {}

const Login: NextPage<TProps> = () => {
  return <PageLogin />
}

Login.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Login
