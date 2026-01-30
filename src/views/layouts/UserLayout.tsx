import * as React from 'react'
import { NextPage } from 'next'
import { AppBar, Toolbar, Typography, CssBaseline, Box, Container, IconButton, Badge } from '@mui/material'
import HeaderLayout from './HeaderLayout'

type Props = {
  children: React.ReactNode
}

const UserLayout: NextPage<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      // Header đó bro
      <HeaderLayout />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: theme => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900])
        }}
      >
        {/* đẩy content xuống dưới AppBar */}
        <Toolbar />

        <Container maxWidth='lg' sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default UserLayout
