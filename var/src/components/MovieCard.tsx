import type { Movie } from '../types/movie'
import Icon from './Icon'

type MovieCardProps = {
  movie: Movie
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  priority?: boolean
  saved: boolean
}

export function MovieCard({ movie, onSelect, onToggleSaved, priority = false, saved }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__surface">
        <button
          aria-label={`Открыть фильм «${movie.title}»`}
          className="movie-card__main"
          onClick={() => onSelect(movie)}
          type="button"
        >
          <span className="movie-card__poster-wrap">
            <img
              alt={`Постер фильма «${movie.title}»`}
              className="movie-card__poster"
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              loading={priority ? 'eager' : 'lazy'}
              src={movie.poster}
            />
            <span className="movie-card__rating">
              <Icon name="star" size={13} />
              {movie.rating.toFixed(1)}
            </span>
          </span>
          <span className="movie-card__info">
            <strong>{movie.title}</strong>
            <span>
              {movie.year} <i aria-hidden="true">·</i> {movie.genre}
            </span>
          </span>
        </button>
        <button
          aria-label={saved ? `Убрать «${movie.title}» из списка` : `Добавить «${movie.title}» в список`}
          aria-pressed={saved}
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => onToggleSaved(movie)}
          type="button"
        >
          <Icon name={saved ? 'check' : 'bookmark'} size={17} />
        </button>
      </div>
    </article>
  )
}
