/**
 * Pagination Configuration
 * Centralized config for all pagination settings
 */

export const PAGINATION_CONFIG = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  defaultPageSize: 10,
  maxRowsPerPage: 100
}

export type PaginationModel = {
  page: number
  pageSize: number
}

export const getPageSizeLabel = (value: number): string => {
  if (value === 100) return 'Show all'
  
  return `${value}`
}
