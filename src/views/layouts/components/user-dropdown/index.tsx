import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'
import * as React from 'react'
import IconifyIcon from 'src/components/Icon'
import { useAuth } from 'src/hooks/useAuth'

const UserDropDown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()
  const open = Boolean(anchorEl)
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Box
        sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleClose}
      >
        <Tooltip title='Account'>
          <IconButton
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 28, height: 28 }}>
              {user?.avatar ? (
                <Image src={user.avatar} alt='Avatar' width={28} height={28} style={{ borderRadius: '50%' }} />
              ) : (
                <IconifyIcon icon='mdi:user-circle-outline' width={20} height={20} />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id='account-menu'
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0
                }
              }
            }
          }}
          MenuListProps={{
            onMouseEnter: () => setAnchorEl(anchorEl),
            onMouseLeave: handleClose
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>Tài khoản của tôi</MenuItem>

          <Divider />
          <MenuItem onClick={handleClose}>Đơn mua</MenuItem>

          <MenuItem onClick={logout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </React.Fragment>
  )
}

export default UserDropDown
