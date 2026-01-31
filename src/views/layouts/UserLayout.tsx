import { Box, Container, CssBaseline, Toolbar } from '@mui/material'
import { NextPage } from 'next'
import * as React from 'react'
import FooterLayout from './FooterLayout'
import HeaderLayout from './HeaderLayout'

type Props = {
  children: React.ReactNode
}

const UserLayout: NextPage<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      {/* Header đó bro */}
      <HeaderLayout />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          pb: 4
        }}
      >
        {/* đẩy content xuống dưới AppBar */}
        <Toolbar />
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>

      <FooterLayout />
    </Box>
  )
}

export default UserLayout
