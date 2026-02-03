import { Stack, styled } from '@mui/material'

const SignInContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4)
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    backgroundRepeat: 'no-repeat'
  }
}))

export default SignInContainer
