import { createSlice } from '@reduxjs/toolkit'
import { OrderDetailType, OrderWithItemsType } from 'src/types/order'
import { fetchOrdersAsync, createOrderAsync, fetchOrderDetailAsync, cancelOrderAsync } from './actions'

interface OrderState {
  orders: OrderWithItemsType[]
  orderDetail: OrderDetailType | null
  totalItems: number
  page: number
  limit: number
  totalPages: number
  isLoading: boolean
  isCreating: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  orderDetail: null,
  totalItems: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  isCreating: false,
  error: null
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderDetail: state => {
      state.orderDetail = null
    },
    clearOrderError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    // Fetch orders
    builder.addCase(fetchOrdersAsync.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (action.payload?.data) {
        state.orders = action.payload.data.data || []
        state.totalItems = action.payload.data.totalItems || 0
        state.page = action.payload.data.page || 1
        state.limit = action.payload.data.limit || 10
        state.totalPages = action.payload.data.totalPages || 0
      }
    })
    builder.addCase(fetchOrdersAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Không thể tải đơn hàng'
    })

    // Create order
    builder.addCase(createOrderAsync.pending, state => {
      state.isCreating = true
      state.error = null
    })
    builder.addCase(createOrderAsync.fulfilled, state => {
      state.isCreating = false
    })
    builder.addCase(createOrderAsync.rejected, (state, action) => {
      state.isCreating = false
      state.error = action.error.message || 'Không thể tạo đơn hàng'
    })

    // Fetch order detail
    builder.addCase(fetchOrderDetailAsync.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchOrderDetailAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orderDetail = action.payload?.data || null
    })
    builder.addCase(fetchOrderDetailAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Không thể tải chi tiết đơn hàng'
    })

    // Cancel order
    builder.addCase(cancelOrderAsync.pending, state => {
      state.isLoading = true
    })
    builder.addCase(cancelOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false
      const cancelledOrder = action.payload?.data
      if (cancelledOrder) {
        const index = state.orders.findIndex(o => o.id === cancelledOrder.id)
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], status: 'CANCELLED' }
        }
      }
    })
    builder.addCase(cancelOrderAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Không thể hủy đơn hàng'
    })
  }
})

export const { clearOrderDetail, clearOrderError } = orderSlice.actions
export default orderSlice.reducer
