import Typography, { TypographyProps } from '@mui/material/Typography'
import React from 'react'

interface CustomWelcomeProps extends TypographyProps {
  children: React.ReactNode
}

/**
 * CustomWelcome: Reusable welcome title component
 * Usage: <CustomWelcome>Welcome to user roles</CustomWelcome>
 */
const CustomWelcome: React.FC<CustomWelcomeProps> = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      mb: 2,
      fontSize: 24,
      fontWeight: 600,
      color: 'text.primary',
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
)

export default CustomWelcome
