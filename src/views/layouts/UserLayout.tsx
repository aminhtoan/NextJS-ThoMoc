import { Box, Container, CssBaseline } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import * as React from 'react'
import GeminiChatBot from 'src/components/GeminiChatBot'
import FooterLayout from './FooterLayout'
import HeaderLayout from './HeaderLayout'

type Props = {
  children: React.ReactNode
}

const UserLayout: NextPage<Props> = ({ children }) => {
  const router = useRouter()

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
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>

      <FooterLayout />
      {router.pathname === '/' && <GeminiChatBot />}
    </Box>
  )
}

export default UserLayout
