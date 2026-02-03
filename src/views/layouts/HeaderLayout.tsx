import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { AppBar, Avatar, Badge, IconButton, Toolbar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import { useRouter } from 'next/router'
import UserDropDown from 'src/components/user-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import ModeToggle from './components/mode-toggle'

// type Props = {
//   children: React.ReactNode
// }

const HeaderLayout = () => {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <AppBar
      position='fixed'
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ minHeight: 72, justifyContent: 'center', gap: 20, px: 3 }}>
        {/* LEFT: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 0, cursor: 'pointer' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)'
              }
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
              marginLeft: 1,
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Thổ Mộc
          </Typography>
        </Box>

        {/* CENTER: Search */}
        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            maxWidth: 550,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '28px',
            px: 3,
            py: 1,
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover, &:focus-within': {
              bgcolor: '#fff',
              boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.12)'
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
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: '#999',
                  opacity: 0.8
                }
              }
            }}
          />
        </Box>

        {/* RIGHT: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 0 }}>
          <IconButton
            color='inherit'
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Badge badgeContent={2} color='error' sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', right: 1 } }}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user ? (
            <UserDropDown />
          ) : (
            <Avatar
              onClick={() => router.push('/login')}
              sx={{
                width: 25,
                height: 25,
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' },
                ml: 5
              }}
            />
          )}
          <ModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLayout
