// MUI icons
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

// MUI
import { AppBar, Badge, Container, IconButton, Paper, Toolbar, Typography, Box, InputBase } from '@mui/material'

// Next
import { useRouter } from 'next/router'

// components
import UserDropDown from 'src/components/user-dropdown'
import LanguageDropDown from './components/language-dropdown'
import ModeToggle from './components/mode-toggle'

// Configs
import { AUTH_LOG } from 'src/configs/auth'

// Hooks
import { useAuth } from 'src/hooks/useAuth'
import React from 'react'

const HeaderLayout = () => {
  const { user } = useAuth()
  const router = useRouter()

  // Total header heights (dùng để đẩy nội dung tránh bị che khi AppBar fixed)
  const TOP_BAR_HEIGHT = 25
  const MAIN_BAR_HEIGHT = 80

  return (
    <React.Fragment>
      <AppBar
        position='fixed'
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: '#fff',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1100
        }}
      >
        {/* Container: full width background, bên trong có container giới hạn và căn giữa */}
        <Box sx={{ width: '100%' }}>
          <Container maxWidth='lg' sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            {/* Dùng flex column để chứa 2 toolbar */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Tầng 1: top small bar */}
              <Toolbar
                sx={{
                  minHeight: `${TOP_BAR_HEIGHT}px !important`,
                  height: `${TOP_BAR_HEIGHT}px !important`,
                  lineHeight: `${TOP_BAR_HEIGHT}px !important`,
                  px: 0,
                  justifyContent: 'flex-end',
                  gap: 2,
                  background: 'transparent'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user ? (
                    <UserDropDown />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {AUTH_LOG.map((item, index) => (
                        <Typography
                          key={item.value}
                          sx={{
                            fontSize: '0.9rem',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            '&:hover': { color: 'gray' }
                          }}
                          onClick={() => router.push(item.path)}
                        >
                          {item.label}
                          {index < AUTH_LOG.length - 1 && ' |'}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  <ModeToggle />
                  <LanguageDropDown />
                </Box>
              </Toolbar>

              {/* Tầng 2: main toolbar */}
              <Toolbar
                sx={{
                  minHeight: MAIN_BAR_HEIGHT,
                  px: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* LEFT: logo */}
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                  onClick={() => router.push('/')}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src='/images/logo1.png' alt='Logo' style={{ height: 26 }} />
                  </Box>
                  <Typography
                    variant='h6'
                    noWrap
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      letterSpacing: '0.5px',
                      background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Thổ Mộc
                  </Typography>
                </Box>

                {/* CENTER: search - đặt trong Box có flex:1 và justify center */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      maxWidth: 700,
                      display: 'flex',
                      alignItems: 'center',
                      px: 3,
                      py: 0.8,
                      bgcolor: 'rgba(255,255,255,0.95)',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      '&:hover, &:focus-within': {
                        boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <SearchIcon sx={{ color: '#666', mr: 1.5, fontSize: '1.3rem' }} />
                    <InputBase
                      placeholder='Tìm kiếm sản phẩm...'
                      sx={{
                        flex: 1,
                        color: '#333',
                        fontSize: '0.95rem',
                        '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 0.8 }
                      }}
                    />
                  </Paper>
                </Box>

                {/* RIGHT: actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color='inherit'
                    sx={{ transition: 'all .2s', '&:hover': { transform: 'scale(1.05)' }, mr: '50px' }}
                  >
                    <Badge
                      badgeContent={2}
                      color='error'
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', right: 1 } }}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Box>
              </Toolbar>
            </Box>
          </Container>
        </Box>
      </AppBar>

      {/* --- IMPORTANT: tạo khoảng đẩy nội dung xuống để tránh bị AppBar fixed che --- */}
      <Box sx={{ height: TOP_BAR_HEIGHT + MAIN_BAR_HEIGHT }} />
    </React.Fragment>
  )
}

export default HeaderLayout
