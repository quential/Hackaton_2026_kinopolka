import { useEffect, useMemo, useState } from 'react'
import { getDefaultReviews } from '../data/reviews'
import type { Movie } from '../types/movie'
import type { MovieReview, ReviewDraft } from '../types/review'
import Icon from './Icon'
import { MovieReviewsPanel } from './MovieReviewsPanel'

type MovieModalProps = {
  movie: Movie
  onAddReview: (movie: Movie, review: ReviewDraft) => void
  onClose: () => void
  onToggleSaved: (movie: Movie) => void
  onWatch: (movie: Movie) => void
  saved: boolean
  userReviews: MovieReview[]
}

export function MovieModal({
  movie,
  onAddReview,
  onClose,
  onToggleSaved,
  onWatch,
  saved,
  userReviews,
}: MovieModalProps) {
  const [reviewsMovieId, setReviewsMovieId] = useState<string | null>(null)
  const isReviewsOpen = reviewsMovieId === movie.id
  const reviews = useMemo(() => [...getDefaultReviews(movie), ...userReviews], [movie, userReviews])

  useEffect(() => {
    if (!movie) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [movie, onClose])

  return (
    <div
      aria-label="Подробности фильма"
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div aria-modal="true" className={`movie-modal ${isReviewsOpen ? 'is-reviews-open' : ''}`} role="dialog">
        <button aria-label="Закрыть" className="modal-close" onClick={onClose} type="button">
          <Icon name="close" size={20} />
        </button>
        <div className="movie-modal__poster-wrap">
          <img alt={`Постер фильма «${movie.title}»`} className="movie-modal__poster" src={movie.poster} />
        </div>
        <div className="movie-modal__content">
          <p className="eyebrow">{movie.originalTitle}</p>
          <h2>{movie.title}</h2>
          <div className="movie-modal__meta">
            <span>{movie.year}</span>
            <span>{movie.ageRating}</span>
            <span>{movie.genre}</span>
            <span>
              <Icon name="clock" size={15} /> {movie.duration} мин
            </span>
            <span className="rating-value">
              <Icon name="star" size={15} /> {movie.rating.toFixed(1)}
            </span>
          </div>
          <p className="movie-modal__tagline">{movie.tagline}</p>
          <p className="movie-modal__description">{movie.description}</p>
          <dl className="movie-facts">
            <div>
              <dt>Режиссёр</dt>
              <dd>{movie.director}</dd>
            </div>
            <div>
              <dt>В ролях</dt>
              <dd>{movie.cast.join(', ')}</dd>
            </div>
          </dl>
          <div className="movie-modal__actions">
            <button className="button button--primary" onClick={() => onWatch(movie)} type="button">
              <Icon name="play" size={17} /> Смотреть
            </button>
            <button
              aria-pressed={saved}
              className="button button--secondary"
              onClick={() => onToggleSaved(movie)}
              type="button"
            >
              <Icon name={saved ? 'check' : 'bookmark'} size={17} />
              {saved ? 'В списке' : 'Посмотреть позже'}
            </button>
            <button
              aria-controls="movie-modal-reviews"
              aria-expanded={isReviewsOpen}
              className={`button button--secondary movie-modal__reviews-toggle ${isReviewsOpen ? 'is-active' : ''}`}
              onClick={() => setReviewsMovieId((openMovieId) => (openMovieId === movie.id ? null : movie.id))}
              type="button"
            >
              <Icon name="star" size={16} />
              Оценки
              <span className="movie-modal__reviews-count">{reviews.length}</span>
              <Icon name="chevron-down" size={15} />
            </button>
          </div>
        </div>
        <div className="movie-modal__reviews-reveal" id="movie-modal-reviews">
          <div className="movie-modal__reviews-inner">
            <MovieReviewsPanel onSubmit={(review) => onAddReview(movie, review)} reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  )
}
