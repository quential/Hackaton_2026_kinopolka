import type { Genre, Movie } from '../types/movie'
import Icon from './Icon'
import { MovieCard } from './MovieCard'

type GenrePageProps = {
  genre: Genre
  movies: Movie[]
  onBack: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
}

const genreCopy: Record<Genre, { title: string; description: string }> = {
  драма: {
    title: 'Драма',
    description: 'Истории с сильными героями, честными эмоциями и послевкусием после финальных титров.',
  },
  комедия: {
    title: 'Комедия',
    description: 'Фильмы, с которыми вечер становится легче, теплее и немного смешнее.',
  },
  фантастика: {
    title: 'Фантастика',
    description: 'Новые миры, большие идеи и истории, которые расширяют границы привычного.',
  },
  триллер: {
    title: 'Триллер',
    description: 'Напряжённые сюжеты, неожиданные повороты и фильмы, от которых сложно оторваться.',
  },
}

export function GenrePage({
  genre,
  movies,
  onBack,
  onSelect,
  onToggleSaved,
  savedIds,
}: GenrePageProps) {
  const { title, description } = genreCopy[genre]
  const genreMovies = movies
    .filter((movie) => movie.genres.includes(genre))
    .sort((first, second) => second.rating - first.rating)

  return (
    <main className="page genre-page" id={`genre-${genre}`}>
      <button className="genre-page__back" onClick={onBack} type="button">
        К подборкам
      </button>

      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div aria-label={`Фильмов в подборке: ${genreMovies.length}`} className="genre-page__count">
          <Icon name="bookmark" size={17} />
          <span>{genreMovies.length} фильмов</span>
        </div>
      </div>

      {genreMovies.length > 0 ? (
        <div className="movie-grid genre-page__grid">
          {genreMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onToggleSaved={onToggleSaved}
              priority={index < 4}
              saved={savedIds.has(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={24} />
          <strong>В этом жанре пока пусто</strong>
          <p>Попробуйте выбрать другую подборку.</p>
        </div>
      )}
    </main>
  )
}
