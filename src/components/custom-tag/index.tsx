import Box from '@mui/material/Box';
import React from 'react';

interface CustomTagProps {
  color?: string;
  bgcolor?: string;
  children: React.ReactNode;
  fontSize?: number | string;
  minWidth?: number | string;
}

const CustomTag: React.FC<CustomTagProps> = ({
  color = '#1cbb8c',
  bgcolor = 'rgba(28, 187, 140, .15)',
  children,
  fontSize = 10,
  minWidth = 'auto',
}) => (
  <Box
    sx={{
      display: 'inline-block',
      px: 1.5,
      py: 0.5,
      borderRadius: 0.5,
      fontWeight: 'bold',
      fontSize,
      bgcolor,
      color,
      minWidth,
      textAlign: 'center',
    }}
  >
    {children}
  </Box>
);

export default CustomTag;
