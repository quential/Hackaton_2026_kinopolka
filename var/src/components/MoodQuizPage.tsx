import { useMemo, useState } from 'react'
import {
  getMoodRecommendations,
  moodQuestions,
  type MoodQuizAnswers,
} from '../data/moodQuiz'
import type { Movie } from '../types/movie'
import { MoodQuizQuestion } from './MoodQuizQuestion'
import { MoodQuizResults } from './MoodQuizResults'

type MoodQuizPageProps = {
  movies: Movie[]
  onBack: () => void
  onSelect: (movie: Movie) => void
  onToggleSaved: (movie: Movie) => void
  savedIds: Set<string>
}

export function MoodQuizPage({
  movies,
  onBack,
  onSelect,
  onToggleSaved,
  savedIds,
}: MoodQuizPageProps) {
  const [answers, setAnswers] = useState<MoodQuizAnswers>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = moodQuestions[currentStep]
  const selectedAnswerId = answers[currentQuestion.id]
  const recommendations = useMemo(() => getMoodRecommendations(movies, answers), [answers, movies])
  const progress = ((currentStep + 1) / moodQuestions.length) * 100
  const isLastQuestion = currentStep === moodQuestions.length - 1

  const selectAnswer = (answerId: string) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [currentQuestion.id]: answerId }))
  }

  const nextStep = () => {
    if (!selectedAnswerId) return

    if (isLastQuestion) {
      setShowResults(true)
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const restart = () => {
    setAnswers({})
    setCurrentStep(0)
    setShowResults(false)
  }

  if (showResults) {
    return (
      <main className="page mood-quiz-page" id="mood">
        <button className="mood-quiz__back" onClick={onBack} type="button">
          К подборкам
        </button>
        <MoodQuizResults
          answers={answers}
          movies={recommendations}
          onRestart={restart}
          onSelect={onSelect}
          onToggleSaved={onToggleSaved}
          savedIds={savedIds}
        />
      </main>
    )
  }

  return (
    <main className="page mood-quiz-page" id="mood">
      <button className="mood-quiz__back" onClick={onBack} type="button">
        К подборкам
      </button>

      <div className="mood-quiz__progress-block">
        <div className="mood-quiz__progress-copy">
          <span>Найти свой фильм</span>
          <span>Вопрос {currentStep + 1} из {moodQuestions.length}</span>
        </div>
        <div aria-valuemax={moodQuestions.length} aria-valuemin={0} aria-valuenow={currentStep + 1} className="mood-quiz__progress" role="progressbar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <MoodQuizQuestion
        onSelect={selectAnswer}
        question={currentQuestion}
        selectedAnswerId={selectedAnswerId}
      />

      <div className="mood-quiz__actions">
        {currentStep > 0 ? (
          <button className="button button--secondary" onClick={() => setCurrentStep((step) => step - 1)} type="button">
            Назад
          </button>
        ) : (
          <span />
        )}
        <button className="button button--primary" disabled={!selectedAnswerId} onClick={nextStep} type="button">
          {isLastQuestion ? 'Показать фильмы' : 'Дальше'}
        </button>
      </div>
    </main>
  )
}
