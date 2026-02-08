import { Box, Typography } from '@mui/material'
import React, { useRef } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  error?: string
  disabled?: boolean
  length?: number
  label?: string
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  length = 6,
  label = 'Mã OTP'
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return

    const newValue = value.split('')
    newValue[index] = val
    const result = newValue.join('').slice(0, length)

    onChange(result)

    // Auto focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all digits are filled
    if (result.length === length && onComplete) {
      onComplete(result)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, length)

    if (pastedDigits) {
      onChange(pastedDigits)
      if (pastedDigits.length === length && onComplete) {
        onComplete(pastedDigits)
      }
      inputRefs.current[Math.min(pastedDigits.length, length - 1)]?.focus()
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: '220px',
        maxWidth: '400px',
        margin: '0 auto',
        border: error ? '2px solid #d32f2f' : '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: { xs: '10px', sm: '24px' },
        backgroundColor: '#fafafa',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        overflowX: 'auto'
      }}
    >
      {label && (
        <Typography
          variant='subtitle2'
          sx={{
            mb: 2,
            fontWeight: 500,
            fontFamily: 'Poppins, sans-serif',
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          {label}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: '4px', sm: '12px' },
          mb: 2,
          flexWrap: 'nowrap',
          minHeight: { xs: '60px', sm: 'auto' },
          overflowX: 'auto'
        }}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={el => (inputRefs.current[index] = el)}
            type='text'
            maxLength={1}
            value={value[index] || ''}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            inputMode='numeric'
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: '600',
              border: error ? '2px solid #d32f2f' : '2px solid #e0e0e0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.2s ease',
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: disabled ? '#f5f5f5' : '#fff',
              cursor: disabled ? 'not-allowed' : 'text',
              opacity: disabled ? 0.6 : 1
            }}
            onFocus={e => {
              if (!error) {
                e.target.style.borderColor = '#1975D1'
                e.target.style.boxShadow = '0 0 0 3px rgba(25, 117, 209, 0.1)'
              }
            }}
            onBlur={e => {
              e.target.style.borderColor = error ? '#d32f2f' : '#e0e0e0'
              e.target.style.boxShadow = 'none'
            }}
          />
        ))}
      </Box>

      {error && (
        <Typography
          variant='caption'
          sx={{
            color: '#d32f2f',
            display: 'block',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            mt: 1
          }}
        >
          {error}
        </Typography>
      )}

      <Typography
        variant='caption'
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary',
          fontFamily: 'Poppins, sans-serif',
          mt: 2
        }}
      >
        {value.length}/{length} mã nhập
      </Typography>
    </Box>
  )
}

export default OtpInput
