import { useEffect, useRef } from 'react'
import type { Movie } from '../types/movie'
import Icon from './Icon'
import { MovieCard } from './MovieCard'
import { SectionHeading } from './SectionHeading'

type MovieRailProps = {
  actionLabel?: string
  eyebrow?: string
  movies: Movie[]
  onAction?: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
  title: string
  variant?: 'default' | 'editorial'
}

export function MovieRail({
  actionLabel,
  eyebrow,
  movies,
  onAction,
  onSelect,
  onToggleSaved,
  savedIds,
  title,
  variant = 'default',
}: MovieRailProps) {
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [movies])

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ behavior: 'smooth', left: direction * 360 })
  }

  return (
    <section className={`content-section ${variant === 'editorial' ? 'content-section--editorial' : ''}`}>
      <SectionHeading actionLabel={actionLabel} eyebrow={eyebrow} onAction={onAction} title={title} />
      <div className="rail-shell">
        <button
          aria-label="Предыдущие фильмы"
          className="rail-control rail-control--left"
          onClick={() => scrollRail(-1)}
          type="button"
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <div className={`movie-rail ${variant === 'editorial' ? 'movie-rail--editorial' : ''}`} ref={railRef}>
          {movies.map((movie, index) => (
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
