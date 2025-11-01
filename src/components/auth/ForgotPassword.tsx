import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'

interface Props {
  open: boolean
  handleClose: () => void
}

const ForgotPassword = (props: Props) => {
  const { open, handleClose } = props

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Quên mật khẩu</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Nhập email của bạn để đặt lại mật khẩu
        </Typography>
        <TextField autoFocus fullWidth label='Email' type='email' variant='outlined' margin='normal' />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='error'>
          Đóng
        </Button>
        <Button variant='contained'>Gửi yêu cầu</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPassword
