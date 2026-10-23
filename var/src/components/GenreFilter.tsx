import type { GenreFilter } from '../types/movie'

type GenreFilterProps = {
  value: GenreFilter
  onChange: (genre: GenreFilter) => void
}

const filters: Array<{ label: string; value: GenreFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Драма', value: 'драма' },
  { label: 'Комедия', value: 'комедия' },
  { label: 'Фантастика', value: 'фантастика' },
  { label: 'Триллер', value: 'триллер' },
]

export function GenreFilter({ value, onChange }: GenreFilterProps) {
  return (
    <div aria-label="Фильтр по жанру" className="filter-row" role="group">
      {filters.map((filter) => (
        <button
          aria-pressed={value === filter.value}
          className={`filter-pill ${value === filter.value ? 'is-selected' : ''}`}
          key={filter.value}
          onClick={() => onChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
