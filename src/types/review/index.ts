export interface ProductItem {
  id: number
  name: string
  images: string[]
  basePrice: number
  reviewCount: number
  avgRating: number
}

export interface ReviewMedia {
  id: number
  url: string
}

export interface ReviewUser {
  id: number
  name: string
  avatar: string
}

export interface ReviewProduct {
  id: number
  name: string
  images: string[]
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
  medias: ReviewMedia[]
  user: ReviewUser
  product: ReviewProduct
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

export const RATING_COLORS: Record<number, string> = {
  1: '#f44336',
  2: '#ff9800',
  3: '#ffc107',
  4: '#8bc34a',
  5: '#4caf50'
}
