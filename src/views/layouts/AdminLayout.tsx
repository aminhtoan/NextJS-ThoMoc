import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import { NextPage } from 'next'
import * as React from 'react'

import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

type Props = {
  children: React.ReactNode
}
const AdminLayout: NextPage<Props> = ({ children }) => {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminHeader open={open} toggleDrawer={toggleDrawer} />
      <AdminSidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240
                }}
              >
                {children}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default AdminLayout
