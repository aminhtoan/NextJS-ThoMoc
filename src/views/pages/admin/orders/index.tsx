import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { NextPage } from 'next/types'

type TProps = {}
const OrdersPage: NextPage<TProps> = () => {
  const orders = [
    { id: '001', customer: 'Nguyễn Văn A', status: 'Pending', total: 500000 },
    { id: '002', customer: 'Trần Thị B', status: 'Completed', total: 1200000 },
    { id: '003', customer: 'Lê Văn C', status: 'Cancelled', total: 750000 }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' fontWeight={700} mb={3}>
        Quản Lý Đơn Hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Mã ĐH</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell align='right'>Tổng Tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell
                  sx={{
                    color: order.status === 'Completed' ? 'green' : order.status === 'Pending' ? 'orange' : 'red'
                  }}
                >
                  {order.status}
                </TableCell>
                <TableCell align='right'>{order.total.toLocaleString()} đ</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default OrdersPage
