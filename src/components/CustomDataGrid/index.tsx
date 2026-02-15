import * as React from 'react'
import { DataGrid, DataGridProps, GridRowClassNameParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'

const CustomDataGrid: React.FC<DataGridProps> = ({ sx, ...props }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        getRowClassName={(params: GridRowClassNameParams) => {
          return params.row?.deletedAt ? 'row-deleted' : ''
        }}
        isRowSelectable={params => !params.row?.deletedAt}
        sx={{
          border: 1,
          borderColor: 'divider',
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
          '& .row-deleted': {
            backgroundColor: 'rgba(220, 53, 69, 0.15) !important'
          },
          '& .row-deleted:hover': {
            backgroundColor: 'rgba(220, 53, 69, 0.25) !important'
          },
          '& .row-deleted .MuiDataGrid-cell': {
            color: '#dc3545',
            textDecoration: 'line-through'
          },
          ...sx
        }}
        autoHeight
        {...props}
      />
    </Box>
  )
}

export default CustomDataGrid
