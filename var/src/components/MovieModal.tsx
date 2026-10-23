import { useEffect } from 'react'
import type { Movie } from '../types/movie'
import Icon from './Icon'

type MovieModalProps = {
  movie: Movie | null
  onClose: () => void
  onToggleSaved: (movie: Movie) => void
  onWatch: (movie: Movie) => void
  saved: boolean
}

export function MovieModal({
  movie,
  onClose,
  onToggleSaved,
  onWatch,
  saved,
}: MovieModalProps) {
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

  if (!movie) return null

  return (
    <div
      aria-label="Подробности фильма"
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div aria-modal="true" className="movie-modal" role="dialog">
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
          </div>
        </div>
      </div>
    </div>
  )
}
