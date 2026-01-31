import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { decodeAccessToken, getAccessToken } from 'src/service/token'
import AdminLayout from 'src/views/layouts/AdminLayout'
import Error404 from '../404'
import { useRouter } from 'next/router'

const AdminPage: NextPage = () => {
  const [noPermission, setNoPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      setIsLoading(false)
      router.replace('/login')

      return
    }

    try {
      const info = decodeAccessToken(token)
      if (!info || info.roleName !== 'ADMIN') {
        setNoPermission(true)
      }
    } catch {
      setNoPermission(true)
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) return null

  if (noPermission) {
    return <Error404 />
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Admin Dashboard</h1>
    </div>
  )
}

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>
AdminPage.authGuard = true
AdminPage.guestGuard = false

export default AdminPage
