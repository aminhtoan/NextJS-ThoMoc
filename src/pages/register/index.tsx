import { NextPage } from 'next'
import BlankLayout from 'src/views/layouts/BlankLayout'
import PageRegister from 'src/views/pages/register'

type TProps = {}

const Register: NextPage<TProps> = () => {
  return <PageRegister />
}

Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true
export default Register
