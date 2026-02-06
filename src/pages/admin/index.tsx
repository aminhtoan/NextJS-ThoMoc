import { Box, Typography } from '@mui/material'
import { NextPage } from 'next'
import AdminLayout from 'src/views/layouts/AdminLayout/AdminLayout'

const AdminPage: NextPage = () => {
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

AdminPage.getLayout = page => <AdminLayout>{page}</AdminLayout>

export default AdminPage
