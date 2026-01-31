import { getAccessToken, decodeAccessToken } from 'src/service/token'
import { useEffect, useState } from 'react'
import { AccessTokenPayLoad } from 'src/types/jwt'
import Error404 from '../404'
import SellerLayout from 'src/views/layouts/SellerLayout'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const SellerPage: NextPage = () => {
  const [userInfo, setUserInfo] = useState<AccessTokenPayLoad | null>(null)
  const [noPermission, setNoPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      const info = decodeAccessToken(token)
      setUserInfo(info)
      if (!info || info.roleName !== 'SELLER') {
        setNoPermission(true)
      }
      setIsLoading(false)
    } else {
      router.replace('/login')
    }
  }, [router])

  if (isLoading) return null
  if (noPermission) return <Error404 />

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Seller Dashboard</h1>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  )
}

SellerPage.getLayout = page => <SellerLayout>{page}</SellerLayout>
SellerPage.authGuard = true
SellerPage.guestGuard = false

export default SellerPage
