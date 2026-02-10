// ** MUI
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material/'

// ** Next Import
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React Imports
import * as React from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import { ROUTE_CONFIG } from 'src/configs/route'

// ** Iconify Imports
import IconifyIcon from '../Icon'

// ** Translation Imports
import { useTranslation } from 'react-i18next'

const imgeSize = 20
const UserDropDown = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const open = Boolean(anchorEl)
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <React.Fragment>
      <Box
        sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleClose}
      >
        <Tooltip title={t('My Account')}>
          <IconButton
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#fff' }}>{user?.name}</Typography>

              <Avatar sx={{ width: imgeSize, height: imgeSize }}>
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt='Avatar'
                    width={imgeSize}
                    height={imgeSize}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <IconifyIcon icon='mdi:user-circle-outline' width={imgeSize} height={imgeSize} />
                )}
              </Avatar>
            </Box>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id='account-menu'
          open={open}
          onClose={handleClose}
          disableScrollLock
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
          <MenuItem onClick={() => handleNavigate(ROUTE_CONFIG.MY_PROFILE)}>{t('My Account')}</MenuItem>

          <Divider />
          <MenuItem onClick={handleClose}>{t('Orders')}</MenuItem>

          <MenuItem onClick={logout}>{t('Logout')}</MenuItem>
          {user?.role.name !== 'CLIENT' && (
            <>
              <Divider />
              <MenuItem onClick={() => handleNavigate(ROUTE_CONFIG.HOME)}>{t('Home')}</MenuItem>
              <MenuItem onClick={() => handleNavigate(ROUTE_CONFIG.ADMIN_DASHBOARD)}>{t('Dashoard')}</MenuItem>
            </>
          )}
        </Menu>
      </Box>
    </React.Fragment>
  )
}

export default UserDropDown
