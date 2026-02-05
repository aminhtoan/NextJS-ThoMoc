// ** React
import React from 'react'

// ** Next
import { NextPage } from 'next'

// ** MUI
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'

// ** Views

type Props = {
  children: React.ReactNode
}

const LayoutNotApp: NextPage<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* <HeaderLayout /> */}

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
        {/* Để chừa khoảng trống cho AppBar fixed */}
        <Toolbar />

        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp
