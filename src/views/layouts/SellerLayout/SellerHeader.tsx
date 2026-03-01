import MuiAppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import UserDropDown from 'src/components/UserDropdown'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  boxShadow: theme.shadows[2]
}))

const SellerHeader = () => {
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
        <UserDropDown />
      </Toolbar>
    </AppBar>
  )
}

export default SellerHeader
