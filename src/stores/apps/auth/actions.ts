import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerAuth } from 'src/service/auth'

// ** Add User
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)

  return response.data
})
