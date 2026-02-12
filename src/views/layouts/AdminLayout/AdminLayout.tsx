import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { NextPage } from 'next'
import * as React from 'react'

import AdminHeader from './AdminHeader'
import AdminSidebar, { drawerWidth, miniDrawerWidth } from './AdminSidebar'

type Props = {
  children: React.ReactNode
}
const AdminLayout: NextPage<Props> = ({ children }) => {
  // pinned = true: sidebar luôn mở, hover không có tác dụng
  // pinned = false: sidebar thu nhỏ, hover vào thì mở, hover ra thì thu nhỏ
  const [pinned, setPinned] = React.useState(true)
  const [hovered, setHovered] = React.useState(false)

  const togglePin = () => {
    setPinned(!pinned)
  }

  // Chỉ cho phép hover effect khi không pinned
  const handleMouseEnter = () => {
    if (!pinned) {
      setHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!pinned) {
      setHovered(false)
    }
  }

  // Sidebar mở rộng khi pinned` hoặc đang hover
  const isExpanded = pinned || hovered
  const currentDrawerWidth = isExpanded ? drawerWidth : miniDrawerWidth

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AdminSidebar
        pinned={pinned}
        togglePin={togglePin}
        hovered={hovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          marginLeft: `${currentDrawerWidth}px`,
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: theme =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
        }}
      >
        <AdminHeader />
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ p: 3 }}>
              {children}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default AdminLayout
