import * as React from 'react'
import { NextPage } from 'next'
import { AppBar, Toolbar, Typography, CssBaseline, Box, Container, IconButton, Badge } from '@mui/material'

// type Props = {
//   children: React.ReactNode
// }

const HeaderLayout = () => {
  return (
    <AppBar position='fixed'>
      <Toolbar>
        <Typography variant='h6' noWrap sx={{ flexGrow: 1 }}>
          Thổ Mộc
        </Typography>

        <IconButton color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            {/* Notifications */}
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLayout
