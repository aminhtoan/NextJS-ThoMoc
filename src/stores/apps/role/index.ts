// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { getAllRolesAsync } from './actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  roles: {
    data: [],
    totalItems: 0,
    totalPages: 0
  }
}

export const roleSlice = createSlice({
  name: 'role',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllRolesAsync.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      console.log('action', action)
      state.isLoading = false
      state.roles.data = action.payload.data.data
      state.roles.totalItems = action.payload.data.totalItems
      state.roles.totalPages = action.payload.data.totalPages
    })
    builder.addCase(getAllRolesAsync.rejected, state => {
      state.isLoading = false
      state.roles = { data: [], totalItems: 0, totalPages: 0 }
    })
  }
})

export default roleSlice.reducer
