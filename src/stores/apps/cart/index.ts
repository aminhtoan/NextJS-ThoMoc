import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ShopCartType } from 'src/types/cart'
import { fetchCartAsync, addToCartAsync, updateCartItemAsync, removeCartItemAsync } from './actions'

interface CartState {
  items: ShopCartType[]
  totalItems: number
  page: number
  limit: number
  totalPages: number
  isLoading: boolean
  isAddingToCart: boolean
  error: string | null
  selectedItems: number[] // cart item ids that are selected
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  isAddingToCart: false,
  error: null,
  selectedItems: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelectedItems: (state, action: PayloadAction<number[]>) => {
      state.selectedItems = action.payload
    },
    toggleSelectItem: (state, action: PayloadAction<number>) => {
      const itemId = action.payload
      const index = state.selectedItems.indexOf(itemId)
      if (index === -1) {
        state.selectedItems.push(itemId)
      } else {
        state.selectedItems.splice(index, 1)
      }
    },
    selectAllItems: state => {
      const allItemIds: number[] = []
      state.items.forEach(shop => {
        shop.cartItems?.forEach(item => {
          if (item?.id) allItemIds.push(item.id)
        })
      })
      state.selectedItems = allItemIds
    },
    deselectAllItems: state => {
      state.selectedItems = []
    },
    clearCart: state => {
      state.items = []
      state.totalItems = 0
      state.selectedItems = []
    }
  },
  extraReducers: builder => {
    // Fetch cart
    builder.addCase(fetchCartAsync.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
      state.isLoading = false
      if (action.payload?.data) {
        state.items = action.payload.data.data || []
        state.totalItems = action.payload.data.totalItems || 0
        state.page = action.payload.data.page || 1
        state.limit = action.payload.data.limit || 10
        state.totalPages = action.payload.data.totalPages || 0
      }
    })
    builder.addCase(fetchCartAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Failed to fetch cart'
    })

    // Add to cart
    builder.addCase(addToCartAsync.pending, state => {
      state.isAddingToCart = true
      state.error = null
    })
    builder.addCase(addToCartAsync.fulfilled, state => {
      state.isAddingToCart = false
    })
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.isAddingToCart = false
      state.error = action.error.message || 'Failed to add to cart'
    })

    // Update cart item
    builder.addCase(updateCartItemAsync.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateCartItemAsync.fulfilled, (state, action) => {
      state.isLoading = false
      const { cartItemId, response } = action.payload

      state.items.forEach(shop => {
        const itemIndex = shop.cartItems?.findIndex(item => item?.id === cartItemId)
        if (itemIndex !== undefined && itemIndex !== -1 && shop.cartItems && response?.data) {
          shop.cartItems[itemIndex] = {
            ...shop.cartItems[itemIndex],
            quantity: response.data.quantity
          }
        }
      })
    })
    builder.addCase(updateCartItemAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Failed to update cart item'
    })

    // Remove cart items
    builder.addCase(removeCartItemAsync.pending, state => {
      state.isLoading = true
    })
    builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
      state.isLoading = false
      const { cartItemIds } = action.payload

      // Remove items from statex
      state.items = state.items
        .map(shop => ({
          ...shop,
          cartItems: shop.cartItems?.filter(item => item?.id && !cartItemIds.includes(item.id))
        }))
        .filter(shop => shop.cartItems && shop.cartItems.length > 0)

      // Remove from selected items
      state.selectedItems = state.selectedItems.filter(id => !cartItemIds.includes(id))
      state.totalItems -= cartItemIds.length
    })
    builder.addCase(removeCartItemAsync.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Failed to remove cart items'
    })
  }
})

export const { setSelectedItems, toggleSelectItem, selectAllItems, deselectAllItems, clearCart } = cartSlice.actions

export default cartSlice.reducer
