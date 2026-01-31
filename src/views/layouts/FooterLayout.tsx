import React from 'react'
import { Box, Typography } from '@mui/material'

const FooterLayout: React.FC = () => {
  return (
    <Box
      component='footer'
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: theme => (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800])
      }}
    >
      <Typography variant='body2' color='text.secondary'>
        © {new Date().getFullYear()} Shopping App. All rights reserved.
      </Typography>
    </Box>
  )
}

export default FooterLayout
