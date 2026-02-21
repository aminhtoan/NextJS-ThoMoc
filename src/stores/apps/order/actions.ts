import { createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders, getOrderDetail, cancelOrder } from 'src/service/order'
import { CreateOrderBodyType, GetOrderQueryType } from 'src/types/order'

export const fetchOrdersAsync = createAsyncThunk('order/fetchOrders', async (params?: GetOrderQueryType) => {
  const response = await getOrders(params)

  return response
})

export const createOrderAsync = createAsyncThunk('order/createOrder', async (data: CreateOrderBodyType) => {
  const response = await createOrder(data)

  return response
})

export const fetchOrderDetailAsync = createAsyncThunk('order/fetchOrderDetail', async (orderId: number) => {
  const response = await getOrderDetail(orderId)

  return response
})

export const cancelOrderAsync = createAsyncThunk('order/cancelOrder', async (orderId: number) => {
  const response = await cancelOrder(orderId)

  return response
})
