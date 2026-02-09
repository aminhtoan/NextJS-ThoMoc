import * as React from 'react'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

const CustomDataGrid: React.FC<DataGridProps> = ({ sx, ...props }) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        sx={{
          border: 1,
          borderColor: 'divider',
          display: 'inline-flex',

          '& .MuiDataGrid-footerContainer': {
            justifyContent: 'center'
          },
          '& .MuiTablePagination-spacer': {
            display: 'none'
          },
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'center',
            width: '100%',
            paddingLeft: 0
          },
          ...sx
        }}
        {...props}
      />
    </Box>
  )
}

export default CustomDataGrid
