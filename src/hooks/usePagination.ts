import { useState } from 'react'
import { PAGINATION_CONFIG, PaginationModel } from 'src/configs/pagination'

/**
 * usePagination: Custom hook to manage pagination state
 * Usage: const { page, pageSize, paginationModel, onPaginationModelChange } = usePagination()
 */
export const usePagination = (initialPageSize = PAGINATION_CONFIG.defaultPageSize) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: initialPageSize
  })

  const onPaginationModelChange = (model: PaginationModel) => {
    setPaginationModel(model)
  }

  return {
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    paginationModel,
    onPaginationModelChange
  }
}
