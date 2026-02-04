import { Box, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface OTPInputProps {
  length?: number
  onChange?: (otp: string) => void
  value: string
  disabled: boolean
}

const OTPInput = ({ length = 5, onChange, value, disabled }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value.length === 0) {
      setOtp(Array(length).fill(''))
    }
  }, [value, length])

  const focusInput = (index: number) => {
    const input = inputsRef.current[index]
    if (input) input.focus()
  }

  const handleChange = (
    index: number,
    rawValue: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // Updated type to match MUI's signature
  ) => {
    // Skip during IME composition to prevent duplication
    if ((e.nativeEvent as any).isComposing) return

    // Lấy đúng 1 ký tự số cuối cùng để tránh nhân đôi/IME
    const digit = rawValue.replace(/\D/g, '').slice(-1)

    setOtp(prev => {
      const next = [...prev]
      next[index] = digit || ''
      onChange?.(next.join(''))

      // Auto-advance nếu có số và chưa ở ô cuối
      if (digit && index < length - 1) {
        setTimeout(() => focusInput(index + 1), 0)
      }

      return next
    })
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    // Tránh xử lý khi đang composition (bộ gõ tiếng Việt)
    if ((e.nativeEvent as any)?.isComposing) return

    if (e.repeat) {
      e.preventDefault()

      return
    }

    // Chỉ xử lý Backspace & Arrow
    if (e.key === 'Backspace') {
      e.preventDefault()
      setOtp(prev => {
        const next = [...prev]
        if (next[index]) {
          next[index] = ''
          onChange?.(next.join(''))
        } else if (index > 0) {
          focusInput(index - 1)
        }

        return next
      })

      return
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)

      return
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)

      return
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, length)
    if (!pastedData) return

    const newOtp = Array.from({ length }, (_, i) => pastedData[i] || '')
    setOtp(newOtp)
    onChange?.(newOtp.join(''))

    const nextIndex = newOtp.findIndex(v => v === '')
    focusInput(nextIndex === -1 ? length - 1 : nextIndex)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputRef={el => (inputsRef.current[index] = el)}
          value={digit}
          onChange={e => handleChange(index, e.target.value, e)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          type='text'
          inputProps={{
            maxLength: 1,
            inputMode: 'numeric',
            pattern: '[0-9]*',
            style: { textAlign: 'center', fontSize: '1.25rem', padding: '12px 8px' },
            autoComplete: 'off',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            spellCheck: false
          }}
          disabled={disabled}
          sx={{
            width: 50,
            '& .MuiOutlinedInput-root': {
              height: 56,
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
