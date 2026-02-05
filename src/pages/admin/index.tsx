import { NextPage } from 'next'
import { Box, Typography } from '@mui/material'
import AdminLayout from 'src/views/layouts/AdminLayout'
import { useRouter } from 'next/router'
import PageOrder from './orders'

const AdminPage: NextPage = () => {
  const router = useRouter()
  const page = (router.query.page as string) || 'dashboard'

  const renderContent = () => {
    switch (page) {
      case 'orders':
        return <PageOrder />
      case 'brands':
      // return <BrandsPage />
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant='h4' fontWeight={700}>
              Admin Dashboard
            </Typography>
            <Typography variant='body1' color='textSecondary' mt={1}>
              Chào mừng đến trang quản trị. Vui lòng chọn mục trong menu bên trái.
            </Typography>
          </Box>
        )
    }
  }

  return <Box>{renderContent()}</Box>
}

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default AdminPage
