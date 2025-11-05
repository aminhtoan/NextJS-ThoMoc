import { Box, TextField } from '@mui/material'
import { useState, useRef } from 'react'

interface OTPInputProps {
  length?: number
  onChange?: (otp: string) => void
}

const OTPInput = ({ length = 5, onChange }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const focusInput = (index: number) => {
    const input = inputsRef.current[index]

    // console.log(input)
    if (input) {
      // select để dễ xóa khi người dùng gõ tiếp
      input.focus()
    }
  }
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return // chỉ cho nhập số hoặc xóa

    // Cập nhật state an toàn
    setOtp(prev => {
      const newOtp = [...prev]
      newOtp[index] = value
      onChange?.(newOtp.join(''))

      // if (value && index < length - 1) setTimeout(() => focusInput(index + 1), 0)
      return newOtp
    })
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    if (e.repeat) {
      e.preventDefault()
      
return
    }

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()

      if (otp[index] === '') {
        handleChange(index, e.key)
      }
      
return
    }

    // 2. XỬ LÝ XÓA LÙI 
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1)
    }

    // 3. XỬ LÝ PHÍM ĐIỀU HƯỚNG
    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1)
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('Text').slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('')
    for (let i = 0; i < length; i++) {
      newOtp[i] = newOtp[i] || ''
    }
    setOtp(newOtp)
    onChange?.(newOtp.join(''))
    focusInput(newOtp.findIndex(v => v === '') || length - 1)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputRef={el => (inputsRef.current[index] = el)}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          inputProps={{
            maxLength: 1,
            inputMode: 'numeric',
            style: { textAlign: 'center', fontSize: '1.25rem', padding: '12px 8px' }
          }}
          sx={{
            width: 50,
            '& .MuiOutlinedInput-root': {
              height: 56,
              borderRadius: 2,
              '& fieldset': { borderColor: '#bdbdbd' },
              '&:hover fieldset': { borderColor: '#1976d2' },
              '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 }
            }
          }}
        />
      ))}
    </Box>
  )
}

export default OTPInput
