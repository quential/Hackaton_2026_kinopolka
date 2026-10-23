import { useMemo, useState } from 'react'
import type { GenreFilter, Movie, SortOption } from '../types/movie'
import Icon from './Icon'
import { GenreFilter as GenreFilterButtons } from './GenreFilter'
import { MovieCard } from './MovieCard'

type CatalogPageProps = {
  movies: Movie[]
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
}

const genreLabels: Record<GenreFilter, string> = {
  all: 'Все',
  драма: 'Драма',
  комедия: 'Комедия',
  фантастика: 'Фантастика',
  триллер: 'Триллер',
}

export function CatalogPage({
  movies,
  onSelect,
  onToggleSaved,
  savedIds,
}: CatalogPageProps) {
  const [genre, setGenre] = useState<GenreFilter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('rating')

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
    const nextMovies = movies.filter((movie) => {
      const matchesGenre = genre === 'all' || movie.genres.includes(genre)
      const matchesQuery = !normalizedQuery || movie.title.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
      return matchesGenre && matchesQuery
    })

    return nextMovies.sort((first, second) => {
      if (sort === 'title') return first.title.localeCompare(second.title, 'ru')
      if (sort === 'year') return second.year - first.year
      return second.rating - first.rating
    })
  }, [genre, movies, query, sort])

  return (
    <main className="page catalog-page" id="catalog">
      <div className="catalog-heading">
        <div>
          <h1>Каталог</h1>
        </div>
        <label className="search-field">
          <Icon name="search" size={19} />
          <span className="sr-only">Поиск по названию</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти фильм"
            value={query}
          />
        </label>
      </div>

      <div className="catalog-toolbar">
        <GenreFilterButtons onChange={setGenre} value={genre} />
        <label className="sort-field">
          <span>Сортировать</span>
          <select onChange={(event) => setSort(event.target.value as SortOption)} value={sort}>
            <option value="rating">по рейтингу</option>
            <option value="year">по году</option>
            <option value="title">по названию</option>
          </select>
          <Icon name="chevron-down" size={15} />
        </label>
      </div>

      <div className="results-line">
        <span>{filteredMovies.length} фильмов</span>
        <span>{genreLabels[genre]}</span>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map((movie, index) => (
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
          <strong>Ничего не нашли</strong>
          <p>Попробуйте другой жанр или название.</p>
          <button
            className="button button--secondary"
            onClick={() => {
              setGenre('all')
              setQuery('')
            }}
            type="button"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </main>
  )
}
