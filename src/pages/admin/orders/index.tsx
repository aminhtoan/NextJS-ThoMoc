import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { NextPage } from 'next/types'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import OrdersPage from 'src/views/pages/admin/orders'
type TProps = {}
const PageOrder: NextPage<TProps> = () => {
  return <OrdersPage />
}

//  PageOrder.getLayout = page => <LayoutNotApp>{page}</LayoutNotApp>

export default PageOrder
