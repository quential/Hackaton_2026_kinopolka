import type { MoodQuizQuestion as MoodQuizQuestionData } from '../data/moodQuiz'

type MoodQuizQuestionProps = {
  question: MoodQuizQuestionData
  selectedAnswerId?: string
  onSelect: (answerId: string) => void
}

export function MoodQuizQuestion({ question, selectedAnswerId, onSelect }: MoodQuizQuestionProps) {
  return (
    <section aria-labelledby={`mood-question-${question.id}`} className="mood-quiz__question">
      <div className="mood-quiz__question-copy">
        <h1 id={`mood-question-${question.id}`}>{question.title}</h1>
        <p>{question.description}</p>
      </div>

      <div aria-label={question.title} className="mood-options">
        {question.options.map((option) => {
          const isSelected = option.id === selectedAnswerId

          return (
            <button
              aria-pressed={isSelected}
              className={`mood-option ${isSelected ? 'is-selected' : ''}`}
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              <span aria-hidden="true" className="mood-option__emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
