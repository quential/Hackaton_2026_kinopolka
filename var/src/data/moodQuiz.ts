import type { Genre, Movie } from '../types/movie'

export type MoodQuestionId = 'company' | 'weather' | 'feeling' | 'time'
export type MoodQuizAnswers = Partial<Record<MoodQuestionId, string>>

type GenreWeights = Partial<Record<Genre, number>>

export type MoodOption = {
  id: string
  emoji: string
  label: string
  genreWeights: GenreWeights
  getBonus?: (movie: Movie) => number
}

export type MoodQuizQuestion = {
  id: MoodQuestionId
  title: string
  description: string
  options: MoodOption[]
}

export type SelectedMoodOption = {
  question: MoodQuizQuestion
  option: MoodOption
}

function getAgeRating(movie: Movie) {
  return Number.parseInt(movie.ageRating, 10) || 18
}

export const moodQuestions: MoodQuizQuestion[] = [
  {
    id: 'company',
    title: 'С кем хотите посмотреть фильм?',
    description: 'Учтём компанию, чтобы вечер всем понравился.',
    options: [
      {
        id: 'solo',
        emoji: '🎧',
        label: 'Один / одна',
        genreWeights: { драма: 1.8, фантастика: 1.8, триллер: 1.2 },
        getBonus: (movie) => (movie.rating >= 8.2 ? 0.7 : 0),
      },
      {
        id: 'family',
        emoji: '👨‍👩‍👧‍👦',
        label: 'С семьёй',
        genreWeights: { комедия: 3.8, фантастика: 1.3, драма: 0.7 },
        getBonus: (movie) => {
          const ageRating = getAgeRating(movie)
          if (ageRating <= 12) return 3.6
          if (ageRating <= 16) return 0.4
          return -4
        },
      },
      {
        id: 'friends',
        emoji: '🥂',
        label: 'С друзьями',
        genreWeights: { комедия: 2.8, триллер: 2.7, фантастика: 1.4 },
        getBonus: (movie) => (getAgeRating(movie) >= 16 ? 0.5 : 0),
      },
    ],
  },
  {
    id: 'weather',
    title: 'Какая за окном погода?',
    description: 'Настроим подборку под атмосферу вечера.',
    options: [
      {
        id: 'rain',
        emoji: '🌧️',
        label: 'Дождливо',
        genreWeights: { драма: 1.5, триллер: 1.6, фантастика: 1 },
      },
      {
        id: 'sun',
        emoji: '☀️',
        label: 'Солнечно',
        genreWeights: { комедия: 3, фантастика: 1, драма: 0.3 },
        getBonus: (movie) => (movie.duration <= 135 ? 0.8 : 0),
      },
      {
        id: 'fog',
        emoji: '🌫️',
        label: 'Туманно',
        genreWeights: { триллер: 3.2, фантастика: 2 },
      },
      {
        id: 'clouds',
        emoji: '☁️',
        label: 'Облачно',
        genreWeights: { драма: 2.2, комедия: 1.1 },
      },
    ],
  },
  {
    id: 'feeling',
    title: 'Какого ощущения хочется?',
    description: 'Выберите настроение, в которое хочется погрузиться.',
    options: [
      {
        id: 'comfort',
        emoji: '🫶',
        label: 'Уюта и лёгкости',
        genreWeights: { комедия: 4, драма: 1 },
        getBonus: (movie) => (movie.duration <= 130 ? 0.8 : 0),
      },
      {
        id: 'emotion',
        emoji: '🥹',
        label: 'Глубины и эмоций',
        genreWeights: { драма: 4, фантастика: 0.8 },
      },
      {
        id: 'tension',
        emoji: '😮',
        label: 'Острых ощущений',
        genreWeights: { триллер: 4.2, фантастика: 1.2 },
      },
      {
        id: 'wonder',
        emoji: '✨',
        label: 'Чего-то удивительного',
        genreWeights: { фантастика: 4.2, драма: 0.8 },
      },
    ],
  },
  {
    id: 'time',
    title: 'Сколько времени у вас есть?',
    description: 'Учитываем хронометраж, чтобы фильм точно успел закончиться.',
    options: [
      {
        id: 'short',
        emoji: '⚡',
        label: 'До двух часов',
        genreWeights: {},
        getBonus: (movie) => {
          if (movie.duration <= 120) return 3.3
          if (movie.duration <= 135) return 1.5
          return -2.2
        },
      },
      {
        id: 'evening',
        emoji: '🌙',
        label: 'Обычный вечер',
        genreWeights: {},
        getBonus: (movie) => {
          if (movie.duration >= 115 && movie.duration <= 150) return 3.1
          if (movie.duration <= 170) return 1.1
          return -1.2
        },
      },
      {
        id: 'long',
        emoji: '🛋️',
        label: 'Готов(а) к длинной истории',
        genreWeights: {},
        getBonus: (movie) => {
          if (movie.duration >= 150) return 3.4
          if (movie.duration >= 135) return 1.4
          return -1.8
        },
      },
    ],
  },
]

export function getSelectedMoodOptions(answers: MoodQuizAnswers): SelectedMoodOption[] {
  return moodQuestions.flatMap((question) => {
    const answerId = answers[question.id]
    const option = question.options.find((item) => item.id === answerId)
    return option ? [{ question, option }] : []
  })
}

function getGenreScore(movie: Movie, genreWeights: GenreWeights) {
  return movie.genres.reduce((score, genre) => score + (genreWeights[genre as Genre] ?? 0), 0)
}

export function getMoodRecommendations(movies: Movie[], answers: MoodQuizAnswers, limit = 6) {
  const selectedOptions = getSelectedMoodOptions(answers).map(({ option }) => option)

  return movies
    .map((movie) => {
      const preferenceScore = selectedOptions.reduce(
        (score, option) => score + getGenreScore(movie, option.genreWeights) + (option.getBonus?.(movie) ?? 0),
        0,
      )
      const ratingBonus = (movie.rating - 7) * 0.35

      return { movie, score: preferenceScore + ratingBonus }
    })
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.movie.rating - first.movie.rating ||
        first.movie.title.localeCompare(second.movie.title, 'ru'),
    )
    .slice(0, limit)
    .map(({ movie }) => movie)
}
