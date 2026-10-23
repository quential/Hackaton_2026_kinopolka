export type MovieReview = {
  id: string
  author: string
  comment: string
  rating: number
  createdAt: string
}

export type ReviewDraft = Pick<MovieReview, 'author' | 'comment' | 'rating'>

export type MovieReviewsById = Record<string, MovieReview[]>
