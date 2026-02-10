import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAllRoles } from 'src/service/role'

// ** Add User
export const getAllRolesAsync = createAsyncThunk(
  'role',
  async (data: { params: { page?: number; limit?: number; search?: string } }) => {
    const response = await getAllRoles(data.params)

    return response
  }
)
