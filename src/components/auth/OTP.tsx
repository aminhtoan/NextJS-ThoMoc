// src/components/auth/OTP.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material'
import React, { useCallback, useState } from 'react'
import OTPInput from './OTPInput'

interface OTPProps {
  open: boolean
  handleClose: () => void
  data: any
}

const OTP = (props: OTPProps) => {
  const { open, handleClose, data } = props
  const [otp, setOtp] = useState('')


  const handleVerify = () => {
    if (otp.length === 6) {
      console.log('OTP Code:', otp)
      // Gọi API verify OTP ở đây
      handleClose()
    }
  }

  const handleResend = () => {
    console.log('Resend OTP to:', data.email)
    // Gọi API resend OTP ở đây
  }

  const isOtpComplete = otp.length === 6 && /^\d{6}$/.test(otp)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 400,
          overflowY: 'unset'
        }
      }}
    >
      <DialogTitle sx={{ m: 0 }}>
        <Box>
          <Typography variant='h6' component='h2' fontWeight={550} textAlign='center' sx={{ fontSize: 25 }}>
            We've sent a code
          </Typography>

          <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ mb: 3, fontSize: 15 }}>
            Enter it below
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ paddingLeft: 0 }}>
          <Typography variant='body2' component='label' sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
            Code *
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <OTPInput length={6} onChange={val => setOtp(val)} />
        </Box>

        <Typography variant='body2' sx={{ textAlign: 'center' }}>
          <Button
            variant='text'
            onClick={handleResend}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              p: 0
            }}
          >
            Send again
          </Button>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='contained' onClick={handleVerify} disabled={!isOtpComplete} sx={{ minWidth: 100 }}>
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OTP
