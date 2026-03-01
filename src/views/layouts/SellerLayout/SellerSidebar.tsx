import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import * as React from 'react'

import ListVerticalLayout from './ListVerticalLayout'

interface AdminDrawerProps {
  pinned: boolean
  togglePin: () => void
  hovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const drawerWidth: number = 240
export const miniDrawerWidth: number = 70

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'pinned' && prop !== 'hovered'
})<{ pinned: boolean; hovered: boolean }>(({ theme, pinned, hovered }) => ({
  '& .MuiDrawer-paper': {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    whiteSpace: 'nowrap',
    width: pinned || hovered ? drawerWidth : miniDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    overflowX: 'hidden',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
    zIndex: theme.zIndex.drawer,
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
}))

const SellerSidebar: React.FC<AdminDrawerProps> = ({ pinned, togglePin, hovered, onMouseEnter, onMouseLeave }) => {
  // Tính toán trạng thái hiển thị: mở rộng khi pinned hoặc đang hover
  const isExpanded = pinned || hovered

  return (
    <Drawer
      variant='permanent'
      pinned={pinned}
      hovered={hovered}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          px: isExpanded ? 2 : 0,
          minHeight: '64px !important'
        }}
      >
        {isExpanded && <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'primary.main' }}>Admin</Box>}

        <Tooltip title={pinned ? 'Unpin menu' : 'Pin menu'} placement='right'>
          <IconButton
            onClick={togglePin}
            size='small'
            sx={{
              color: pinned ? 'primary.main' : 'text.secondary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            {pinned ? <RadioButtonCheckedIcon fontSize='small' /> : <RadioButtonUncheckedIcon fontSize='small' />}
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Danh sách dọc các mục */}
      <ListVerticalLayout mini={!isExpanded} />
    </Drawer>
  )
}

export default SellerSidebar
