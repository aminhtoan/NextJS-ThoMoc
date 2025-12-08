import { Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface OTPCountdownProps {
  initialMinutes?: number
  initialSeconds?: number
  onResend: () => Promise<void>
}

const OTPCountdown = ({ initialMinutes = 1, initialSeconds = 59, onResend }: OTPCountdownProps) => {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  // format time
  const format = (v: number) => (v < 10 ? `0${v}` : v)

  // countdown logic
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(s => s - 1)
      } else if (minutes > 0) {
        setMinutes(m => m - 1)
        setSeconds(59)
      } else {
        setIsActive(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  // resend OTP
  const handleResend = async () => {
    await onResend()
    setMinutes(initialMinutes)
    setSeconds(initialSeconds)
    setIsActive(true)
  }

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center' width='315px'>
      <Typography>
        Time Remaining:{' '}
        <b>
          {format(minutes)}:{format(seconds)}
        </b>
      </Typography>

      <Button
        variant='text'
        onClick={handleResend}
        disabled={isActive}
        sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto', p: 0, opacity: isActive ? 0.5 : 1 }}
      >
        Send again
      </Button>
    </Stack>
  )
}

export default OTPCountdown
