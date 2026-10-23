import type { Movie } from '../types/movie'
import Icon from './Icon'
import { MoodPickerPanel } from './MoodPickerPanel'
import { MovieRail } from './MovieRail'

type HomePageProps = {
  editorialMovies: Movie[]
  onRefresh: () => void
  onStartMoodQuiz: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  popularMovies: Movie[]
  savedIds: Set<string>
}

const genreCards = [
  { label: 'Драма', icon: '◌' },
  { label: 'Комедия', icon: '✦' },
  { label: 'Фантастика', icon: '◒' },
  { label: 'Триллер', icon: '◉' },
]

export function HomePage({
  editorialMovies,
  onRefresh,
  onStartMoodQuiz,
  onSelect,
  onToggleSaved,
  popularMovies,
  savedIds,
}: HomePageProps) {
  return (
    <main className="page home-page" id="home">
      <section className="page-intro">
        <h1>Фильмы на вечер</h1>
        <p>Подборка, с которой легко начать.</p>
      </section>

      <MovieRail
        actionLabel="Обновить подборку"
        movies={editorialMovies}
        onAction={onRefresh}
        onSelect={onSelect}
        onToggleSaved={onToggleSaved}
        savedIds={savedIds}
        title="Выбор редакции"
        variant="editorial"
      />

      <MoodPickerPanel onStart={onStartMoodQuiz} />

      <section className="content-section genre-section">
        <div className="section-heading">
          <h2>Если хочется чего-то другого</h2>
        </div>
        <div className="genre-grid">
          {genreCards.map((genre) => (
            <button className="genre-card" key={genre.label} type="button">
              <span className="genre-card__icon">{genre.icon}</span>
              <span>{genre.label}</span>
              <Icon name="chevron-right" size={18} />
            </button>
          ))}
        </div>
      </section>

      <MovieRail
        movies={popularMovies}
        onSelect={onSelect}
        onToggleSaved={onToggleSaved}
        savedIds={savedIds}
        title="Популярное сейчас"
      />
    </main>
  )
}
