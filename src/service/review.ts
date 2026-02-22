import handleAPI from 'src/apis/handleAPI'
import { API_CONFIG } from 'src/configs/api'

export interface ReviewMedia {
  url: string
  type: 'IMAGE' | 'VIDEO'
}

export interface ReviewMediaWithId extends ReviewMedia {
  id: number
  reviewId?: number
  createdAt?: string
}

export interface ReviewUser {
  id: number
  name: string
  avatar: string
}

export interface ReviewItem {
  id: number
  content: string
  rating: number
  orderId: number
  productId: number
  userId: number
  updateCount: number
  createdAt: string
  updatedAt: string
  medias: ReviewMediaWithId[]
  user: ReviewUser
}

export interface ReviewListResponse {
  data: ReviewItem[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface CreateReviewBody {
  content: string
  rating: number
  orderId: number
  productId: number
  medias: ReviewMedia[]
}

export interface UpdateReviewBody {
  content?: string
  rating?: number
  medias?: {
    add?: ReviewMedia[]
    removeIds?: number[]
  }
}

// Get product reviews (public)
export const getProductReviews = async (productId: number, page: number, limit: number) => {
  return await handleAPI(`${API_CONFIG.REVIEW.PRODUCT_REVIEWS}/${productId}?page=${page}&limit=${limit}`)
}

// Get review detail
export const getReviewDetail = async (reviewId: number, productId: number) => {
  return await handleAPI(`${API_CONFIG.REVIEW.DETAIL}/${reviewId}/product/${productId}`)
}

// Create review
export const createReview = async (data: CreateReviewBody) => {
  return await handleAPI(API_CONFIG.REVIEW.REVIEW, data, 'post')
}

// Update review
export const updateReview = async (reviewId: number, data: UpdateReviewBody) => {
  return await handleAPI(`${API_CONFIG.REVIEW.REVIEW}/${reviewId}`, data, 'put')
}
