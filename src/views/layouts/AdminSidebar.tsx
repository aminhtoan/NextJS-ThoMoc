import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import * as React from 'react'

import ListVerticalLayout from './ListVerticalLayout'

interface AdminDrawerProps {
  open: boolean
  toggleDrawer: () => void
}

const drawerWidth: number = 180

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      width: 0
    })
  }
}))
const AdminSidebar: React.FC<AdminDrawerProps> = ({ open, toggleDrawer }) => {
  return (
    <Drawer variant='permanent' open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: 0.5,
          minHeight: '56px !important'
        }}
      >
        <IconButton onClick={toggleDrawer} size='small'>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      {/* Danh sách dọc các mục */}
      <ListVerticalLayout />
    </Drawer>
  )
}

export default AdminSidebar
