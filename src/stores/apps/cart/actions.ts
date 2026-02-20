import { createAsyncThunk } from '@reduxjs/toolkit'
import { createCart, getCart, updateCartItem, removeCartItem } from 'src/service/cart'
import { AddToCartBodyType, UpdateCartItemBodyType } from 'src/types/cart'

// Fetch cart
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await getCart(page, limit)

    return response
  }
)

// Add to cart
export const addToCartAsync = createAsyncThunk('cart/addToCart', async (data: AddToCartBodyType) => {
  const response = await createCart(data)

  return response
})

// Update cart item
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, data }: { cartItemId: number; data: UpdateCartItemBodyType }) => {
    const response = await updateCartItem(cartItemId, data)

    return { cartItemId, response }
  }
)

// Remove cart items
export const removeCartItemAsync = createAsyncThunk('cart/removeCartItem', async (cartItemIds: number[]) => {
  const response = await removeCartItem(cartItemIds)

  return { cartItemIds, response }
})
