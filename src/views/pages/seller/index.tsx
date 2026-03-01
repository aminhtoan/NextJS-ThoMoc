import { Box, Grid, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { IconifyIcon } from 'src/components'
import handleAPI from 'src/apis/handleAPI'

interface SellerDashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  averageProductPrice: number
  productViews: number
  averageRating: number
}

interface TopProduct {
  id: number
  name: string
  totalSales: number
  totalRevenue: number
  image: string
}

interface RecentOrder {
  id: number
  code: string
  customerName: string
  totalPrice: number
  status: string
  createdAt: string
}

interface SalesChartData {
  date: string
  totalSales: number
  totalOrders: number
}

interface SellerDashboard {
  stats: SellerDashboardStats
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
  salesChartData: SalesChartData[]
}

const StatCard = ({ icon, label, value, colorIcon = 'primary' }: any) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color='textSecondary' gutterBottom>
            {label}
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            {typeof value === 'number' && value > 1000000
              ? `${(value / 1000000).toFixed(1)}M`
              : typeof value === 'number' && value > 1000
                ? `${(value / 1000).toFixed(1)}K`
                : typeof value === 'number'
                  ? value.toLocaleString()
                  : value}
          </Typography>
        </Box>
        <Box sx={{ color: `${colorIcon}.main`, fontSize: '32px' }}>
          <IconifyIcon icon={icon} />
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const PageSeller = () => {
  const { t } = useTranslation()
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await handleAPI('dashboard/seller', null, 'get')
      if (res.status === 200) {
        setDashboard(res.data)
      }
    } catch (error) {
      toast.error('Failed to load dashboard')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>Failed to load dashboard data</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('Seller Dashboard')}
      </Typography>

      {/* Main Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon='tabler:shopping-bag' label={t('Total Products')} value={dashboard.stats.totalProducts} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:receipt'
            label={t('Total Orders')}
            value={dashboard.stats.totalOrders}
            colorIcon='info'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:cash'
            label={t('Total Revenue')}
            value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              dashboard.stats.totalRevenue
            )}
            colorIcon='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:star'
            label={t('Avg Rating')}
            value={dashboard.stats.averageRating.toFixed(1)}
            colorIcon='warning'
          />
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:hourglass'
            label={t('Pending Orders')}
            value={dashboard.stats.pendingOrders}
            colorIcon='warning'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:check-circle'
            label={t('Completed Orders')}
            value={dashboard.stats.completedOrders}
            colorIcon='success'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:price-tag'
            label={t('Avg Product Price')}
            value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              dashboard.stats.averageProductPrice
            )}
            colorIcon='info'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon='tabler:eye'
            label={t('Product Views')}
            value={dashboard.stats.productViews}
            colorIcon='error'
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
              {t('Sales & Orders Chart')} (Last 30 Days)
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={dashboard.salesChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis yAxisId='left' />
                <YAxis yAxisId='right' orientation='right' />
                <Tooltip />
                <Legend />
                <Bar yAxisId='left' dataKey='totalSales' fill='#1976d2' name='Total Sales (VND)' />
                <Bar yAxisId='right' dataKey='totalOrders' fill='#43a047' name='Total Orders' />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
              {t('Top Products')}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                      Total Sales
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.topProducts.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}
                          />
                        )}
                        <Typography variant='body2'>{product.name}</Typography>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{product.totalSales}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          product.totalRevenue
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
              {t('Recent Orders')}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Order Code</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Customer</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Total Price</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                          {order.code}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Typography variant='body2'>{order.customerName}</Typography>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <Typography variant='body2'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            order.totalPrice
                          )}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Typography
                          variant='caption'
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '4px',
                            backgroundColor:
                              order.status === 'DELIVERED'
                                ? '#e8f5e9'
                                : order.status === 'PENDING'
                                  ? '#fff3e0'
                                  : '#ffebee',
                            color:
                              order.status === 'DELIVERED'
                                ? '#2e7d32'
                                : order.status === 'PENDING'
                                  ? '#ed6c02'
                                  : '#c62828'
                          }}
                        >
                          {order.status}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Typography variant='body2'>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PageSeller
