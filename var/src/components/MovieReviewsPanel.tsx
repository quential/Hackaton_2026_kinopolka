import { useEffect, useRef, useState } from 'react'
import type { MovieReview, ReviewDraft } from '../types/review'
import Icon from './Icon'
import { StarRating } from './StarRating'

type MovieReviewsPanelProps = {
  onSubmit: (review: ReviewDraft) => void
  reviews: MovieReview[]
}

const reviewDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
})

function formatReviewDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : reviewDateFormatter.format(date)
}

export function MovieReviewsPanel({ onSubmit, reviews }: MovieReviewsPanelProps) {
  const authorInputRef = useRef<HTMLInputElement>(null)
  const [author, setAuthor] = useState('')
  const [comment, setComment] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  useEffect(() => {
    if (selectedRating) authorInputRef.current?.focus()
  }, [selectedRating])

  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedAuthor = author.trim()
    const trimmedComment = comment.trim()
    if (!selectedRating || !trimmedAuthor || !trimmedComment) return

    onSubmit({ author: trimmedAuthor, comment: trimmedComment, rating: selectedRating })
    setAuthor('')
    setComment('')
    setSelectedRating(null)
  }

  return (
    <section aria-label="Оценки и отзывы" className="movie-reviews-panel">
      <div className="movie-reviews-panel__heading">
        <span>Отзывы зрителей</span>
        <span>{reviews.length}</span>
      </div>

      <div className="movie-reviews-panel__list">
        {reviews.map((review) => (
          <article className="movie-review" key={review.id}>
            <div className="movie-review__topline">
              <strong>{review.author}</strong>
              <time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time>
            </div>
            <div aria-label={`Оценка ${review.rating} из 5`} className="movie-review__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon className={star <= review.rating ? 'is-filled' : ''} key={star} name="star" size={11} />
              ))}
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>

      <div className="movie-review-form">
        <p className="movie-review-form__label">Ваша оценка</p>
        <StarRating onChange={setSelectedRating} value={selectedRating} />

        {selectedRating ? (
          <form className="movie-review-form__fields" onSubmit={submitReview}>
            <label>
              <span className="sr-only">Ваше имя</span>
              <input
                autoComplete="name"
                maxLength={40}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Ваше имя"
                ref={authorInputRef}
                required
                value={author}
              />
            </label>
            <label>
              <span className="sr-only">Ваш отзыв</span>
              <textarea
                maxLength={360}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Что думаете о фильме?"
                required
                rows={3}
                value={comment}
              />
            </label>
            <button className="movie-review-form__submit" disabled={!author.trim() || !comment.trim()} type="submit">
              Отправить отзыв
            </button>
          </form>
        ) : (
          <p className="movie-review-form__hint">Выберите звезду, чтобы оставить отзыв.</p>
        )}
      </div>
    </section>
  )
}
