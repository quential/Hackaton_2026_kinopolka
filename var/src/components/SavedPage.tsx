import type { Movie } from '../types/movie'
import Icon from './Icon'
import { MovieCard } from './MovieCard'

type SavedPageProps = {
  movies: Movie[]
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
}

export function SavedPage({ movies, onSelect, onToggleSaved, savedIds }: SavedPageProps) {
  const savedMovies = movies.filter((movie) => savedIds.has(movie.id))

  return (
    <main className="page saved-page" id="saved">
      <div className="page-heading">
        <div>
          <p className="eyebrow">КИНОПОЛКА</p>
          <h1>Посмотреть позже</h1>
          <p>Фильмы, к которым хочется вернуться.</p>
        </div>
        <span className="saved-count">{savedMovies.length}</span>
      </div>

      {savedMovies.length > 0 ? (
        <div className="movie-grid">
          {savedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onToggleSaved={onToggleSaved}
              saved
            />
          ))}
        </div>
      ) : (
        <div className="empty-state empty-state--large">
          <span className="empty-state__icon">
            <Icon name="bookmark" size={26} />
          </span>
          <strong>Здесь пока пусто</strong>
          <p>Откройте фильм и сохраните его, чтобы не искать снова.</p>
        </div>
      )}
    </main>
  )
}
