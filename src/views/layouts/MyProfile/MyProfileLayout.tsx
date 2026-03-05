import { Box, Container, CssBaseline, Paper } from '@mui/material'
import { NextPage } from 'next'
import * as React from 'react'
import FooterLayout from '../FooterLayout'
import HeaderLayout from '../HeaderLayout'
import ProfileSideBar from './ProfileSideBar'

type Props = {
  children: React.ReactNode
}

const MyProfileLayout: NextPage<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Header - dùng chung với layout khác */}
      <HeaderLayout />

      {/* Main Content với Sidebar */}
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
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'flex-start'
            }}
          >
            {/* Sidebar */}
            <ProfileSideBar />

            {/* Content Area */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                sx={{
                  p: 4,
                  mt: 3,
                  minHeight: 436
                }}
              >
                {children}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer - dùng chung với layout khác */}
      <FooterLayout />
    </Box>
  )
}

export default MyProfileLayout
