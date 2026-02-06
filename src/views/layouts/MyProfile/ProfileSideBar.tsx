import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material'

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'

// Hooks
import { useAuth } from 'src/hooks/useAuth'

type MenuItem = {
  key: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItem[]
}

const ProfileSideBar = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const [openAccount, setOpenAccount] = useState(true)

  const menuItems: MenuItem[] = [
    {
      key: 'notifications',
      label: t('Notifications'),
      icon: <NotificationsNoneIcon />,
      path: '/my-profile/notifications'
    },
    {
      key: 'my-account',
      label: t('My Account'),
      icon: <PersonOutlineIcon />,
      children: [
        {
          key: 'profile',
          label: t('Profile'),
          icon: <BadgeOutlinedIcon fontSize='small' />,
          path: '/my-profile'
        },
        {
          key: 'address',
          label: t('Address'),
          icon: <LocationOnOutlinedIcon fontSize='small' />,
          path: '/my-profile/address'
        },
        {
          key: 'change-password',
          label: t('Change Password'),
          icon: <LockOutlinedIcon fontSize='small' />,
          path: '/my-profile/change-password'
        },
        // {
        //   key: 'notification-settings',
        //   label: t('Notification Settings'),
        //   icon: <NotificationsActiveOutlinedIcon fontSize='small' />,
        //   path: '/my-profile/notification-settings'
        // },
        {
          key: 'privacy-settings',
          label: t('Privacy Settings'),
          icon: <SecurityOutlinedIcon fontSize='small' />,
          path: '/my-profile/privacy-settings'
        }
      ]
    },
    {
      key: 'orders',
      label: t('Orders'),
      icon: <ReceiptLongIcon />,
      path: '/my-profile/orders'
    },
    {
      key: 'vouchers',
      label: t('Vouchers'),
      icon: <ConfirmationNumberOutlinedIcon />,
      path: '/my-profile/vouchers'
    },
    {
      key: 'coins',
      label: t('Coins'),
      icon: <MonetizationOnOutlinedIcon />,
      path: '/my-profile/coins'
    }
  ]

  const isActive = (path?: string) => {
    if (!path) return false

    return router.pathname === path
  }

  const handleNavigate = (path?: string) => {
    if (path) {
      router.push(path)
    }
  }

  const handleToggleAccount = () => {
    setOpenAccount(!openAccount)
  }

  return (
    <Box sx={{ width: 220, flexShrink: 0 }}>
      {/* User Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Avatar src={user?.avatar || undefined} sx={{ width: 50, height: 50 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Typography
            variant='subtitle2'
            fontWeight={600}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {user?.name || 'User'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
            onClick={() => handleNavigate('/my-profile')}
          >
            <EditOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography variant='caption'>{t('Edit Profile')}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List component='nav' sx={{ pt: 1 }}>
        {menuItems.map(item => {
          // Item with children (expandable)
          if (item.children) {
            return (
              <React.Fragment key={item.key}>
                <ListItemButton
                  onClick={handleToggleAccount}
                  sx={{
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: '#ee4d2d' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                  {openAccount ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAccount} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {item.children.map(child => (
                      <ListItemButton
                        key={child.key}
                        onClick={() => handleNavigate(child.path)}
                        sx={{
                          py: 0.75,
                          pl: 5,
                          borderRadius: 1,
                          bgcolor: isActive(child.path) ? 'action.selected' : 'transparent',
                          color: isActive(child.path) ? '#ee4d2d' : 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            fontWeight: isActive(child.path) ? 600 : 400
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            )
          }

          // Regular item
          return (
            <ListItemButton
              key={item.key}
              onClick={() => handleNavigate(item.path)}
              sx={{
                py: 1,
                px: 1,
                borderRadius: 1,
                bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive(item.path) ? '#ee4d2d' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? '#ee4d2d' : 'text.primary'
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default ProfileSideBar
