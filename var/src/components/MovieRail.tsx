import { useRef } from 'react'
import type { Movie } from '../types/movie'
import Icon from './Icon'
import { MovieCard } from './MovieCard'
import { SectionHeading } from './SectionHeading'

type MovieRailProps = {
  actionLabel?: string
  movies: Movie[]
  onAction?: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
  title: string
}

export function MovieRail({
  actionLabel,
  movies,
  onAction,
  onSelect,
  onToggleSaved,
  savedIds,
  title,
}: MovieRailProps) {
  const railRef = useRef<HTMLDivElement>(null)

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ behavior: 'smooth', left: direction * 360 })
  }

  return (
    <section className="content-section">
      <SectionHeading actionLabel={actionLabel} onAction={onAction} title={title} />
      <div className="rail-shell">
        <button
          aria-label="Предыдущие фильмы"
          className="rail-control rail-control--left"
          onClick={() => scrollRail(-1)}
          type="button"
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <div className="movie-rail" ref={railRef}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onToggleSaved={onToggleSaved}
              saved={savedIds.has(movie.id)}
            />
          ))}
        </div>
        <button
          aria-label="Следующие фильмы"
          className="rail-control rail-control--right"
          onClick={() => scrollRail(1)}
          type="button"
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </section>
  )
}
