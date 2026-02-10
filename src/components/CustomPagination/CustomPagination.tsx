// ** MUI
import { Box, Pagination } from '@mui/material'

// ** React Imports
import { useTranslation } from 'react-i18next'

interface CustomPaginationProps {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const CustomPagination = ({
  page,
  pageSize,
  totalItems,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange
}: CustomPaginationProps) => {
  const { t } = useTranslation()

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value)
    onPageSizeChange(newSize)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        px: 2,
        py: 1,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        backgroundColor: 'white'
      }}
    >
      {/* Phần bên trái: Hiển thị số dòng */}
      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
        {t('Total: {{total}} items', { total: totalItems })}
      </Box>

      {/* Phần bên phải: Pagination và Page size selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Page size selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '0.875rem' }}>{t('Rows per page')}</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
              width: '60px'
            }}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Box>

        {/* Pagination component */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          color='primary'
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          size='small'
        />
      </Box>
    </Box>
  )
}

export default CustomPagination
