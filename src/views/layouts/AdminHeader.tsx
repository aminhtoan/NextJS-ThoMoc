import MuiAppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  boxShadow: theme.shadows[2]
}))

const AdminHeader = () => {
  return (
    <AppBar>
      <Toolbar
        sx={{
          pr: '24px'
        }}
      >
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton color='inherit'>
          <Badge badgeContent={4} color='secondary'></Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
