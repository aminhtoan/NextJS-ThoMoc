import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { decodeAccessToken, getAccessToken } from 'src/service/token'
import AdminLayout from 'src/views/layouts/AdminLayout'

const AdminPage: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      return
    }

    try {
      const info = decodeAccessToken(token)
      if (!info || info.roleName !== 'ADMIN') {
        router.replace('/')
      }
    } catch {
      router.replace('/')
    }
  }, [router])

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Admin Dashboard</h1>
    </div>
  )
}

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default AdminPage
