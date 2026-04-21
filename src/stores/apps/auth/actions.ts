import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerAuth } from 'src/service/auth'

// ** Add User
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any, { rejectWithValue }) => {
  try {
    const response = await registerAuth(data)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to register' })
  }
})
