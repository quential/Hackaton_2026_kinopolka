import { getSelectedMoodOptions, type MoodQuizAnswers } from '../data/moodQuiz'
import type { Movie } from '../types/movie'
import { MovieCard } from './MovieCard'

type MoodQuizResultsProps = {
  answers: MoodQuizAnswers
  movies: Movie[]
  onRestart: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
}

export function MoodQuizResults({
  answers,
  movies,
  onRestart,
  onSelect,
  onToggleSaved,
  savedIds,
}: MoodQuizResultsProps) {
  const selectedOptions = getSelectedMoodOptions(answers)

  return (
    <section aria-labelledby="mood-results-title" className="mood-results">
      <div className="mood-results__heading">
        <div>
          <p className="eyebrow">Подборка готова</p>
          <h1 id="mood-results-title">Фильмы под ваше настроение</h1>
          <p>Мы учли компанию, погоду, настроение и запас времени — вот лучшие совпадения.</p>
        </div>
        <button className="button button--secondary" onClick={onRestart} type="button">
          Пройти заново
        </button>
      </div>

      <div aria-label="Ваши ответы" className="mood-results__summary">
        {selectedOptions.map(({ question, option }) => (
          <span className="mood-results__answer" key={question.id}>
            <span aria-hidden="true">{option.emoji}</span>
            {option.label}
          </span>
        ))}
      </div>

      <div className="movie-grid mood-results__grid">
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
    </section>
  )
}
