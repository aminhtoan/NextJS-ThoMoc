import { createSlice } from '@reduxjs/toolkit'
import { AdminOrderStatisticsType, AdminOrderType } from 'src/types/order'
import {
  adminFetchOrdersAsync,
  adminFetchOrderDetailAsync,
  adminUpdateOrderStatusAsync,
  adminFetchStatisticsAsync
} from './actions'

interface AdminOrderState {
  orders: AdminOrderType[]
  orderDetail: AdminOrderType | null
  statistics: AdminOrderStatisticsType | null
  totalItems: number
  page: number
  limit: number
  totalPages: number
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}

const initialState: AdminOrderState = {
  orders: [],
  orderDetail: null,
  statistics: null,
  totalItems: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  isUpdating: false,
  error: null
}

export const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState,
  reducers: {
    clearAdminOrderDetail: state => {
      state.orderDetail = null
    },
    clearAdminOrderError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    // Fetch orders
    builder.addCase(adminFetchOrdersAsync.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(adminFetchOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (action.payload?.data) {
        state.orders = action.payload.data.data || []
        state.totalItems = action.payload.data.totalItems || 0
        state.page = action.payload.data.page || 1
        state.limit = action.payload.data.limit || 10
        state.totalPages = action.payload.data.totalPages || 0
      }
    })
    builder.addCase(adminFetchOrdersAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Không thể tải danh sách đơn hàng'
    })

    // Fetch order detail
    builder.addCase(adminFetchOrderDetailAsync.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(adminFetchOrderDetailAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orderDetail = action.payload?.data || null
    })
    builder.addCase(adminFetchOrderDetailAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Không thể tải chi tiết đơn hàng'
    })

    // Update order status
    builder.addCase(adminUpdateOrderStatusAsync.pending, state => {
      state.isUpdating = true
      state.error = null
    })
    builder.addCase(adminUpdateOrderStatusAsync.fulfilled, (state, action) => {
      state.isUpdating = false
      const updatedOrder = action.payload?.data
      if (updatedOrder) {
        const index = state.orders.findIndex(o => o.id === updatedOrder.id)
        if (index !== -1) {
          state.orders[index] = updatedOrder
        }
        if (state.orderDetail?.id === updatedOrder.id) {
          state.orderDetail = updatedOrder
        }
      }
    })
    builder.addCase(adminUpdateOrderStatusAsync.rejected, (state, action) => {
      state.isUpdating = false
      state.error = action.error.message || 'Không thể cập nhật trạng thái đơn hàng'
    })

    // Fetch statistics
    builder.addCase(adminFetchStatisticsAsync.pending, state => {
      state.error = null
    })
    builder.addCase(adminFetchStatisticsAsync.fulfilled, (state, action) => {
      state.statistics = action.payload?.data || null
    })
    builder.addCase(adminFetchStatisticsAsync.rejected, (state, action) => {
      state.error = action.error.message || 'Không thể tải thống kê đơn hàng'
    })
  }
})

export const { clearAdminOrderDetail, clearAdminOrderError } = adminOrderSlice.actions
export default adminOrderSlice.reducer
