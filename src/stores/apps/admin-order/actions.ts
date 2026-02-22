import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminGetOrders, adminGetOrderDetail, adminUpdateOrderStatus, adminGetOrderStatistics } from 'src/service/order'
import { AdminGetOrderQueryType, AdminUpdateOrderStatusType } from 'src/types/order'

export const adminFetchOrdersAsync = createAsyncThunk(
  'adminOrder/fetchOrders',
  async (params?: AdminGetOrderQueryType) => {
    const response = await adminGetOrders(params)

    return response
  }
)

export const adminFetchOrderDetailAsync = createAsyncThunk('adminOrder/fetchOrderDetail', async (orderId: number) => {
  const response = await adminGetOrderDetail(orderId)

  return response
})

export const adminUpdateOrderStatusAsync = createAsyncThunk(
  'adminOrder/updateOrderStatus',
  async ({ orderId, data }: { orderId: number; data: AdminUpdateOrderStatusType }) => {
    const response = await adminUpdateOrderStatus(orderId, data)

    return response
  }
)

export const adminFetchStatisticsAsync = createAsyncThunk('adminOrder/fetchStatistics', async () => {
  const response = await adminGetOrderStatistics()

  return response
})
