// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { registerAuthAsync } from './actions'

// interface Redux {
//   getState: any
//   dispatch: Dispatch<any>
// }

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, state => {
      state.isLoading = true
    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.email
      state.isError = !action.payload?.email
    })
    builder.addCase(registerAuthAsync.rejected, state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
  }
})

export default authSlice.reducer
