import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMovies } from './api/movies'
import { CatalogPage } from './components/CatalogPage'
import { ErrorState } from './components/ErrorState'
import { GenrePage } from './components/GenrePage'
import GlassHeader, { type AppView } from './components/GlassHeader'
import { HomePage } from './components/HomePage'
import { LoadingState } from './components/LoadingState'
import { MovieModal } from './components/MovieModal'
import { MoodQuizPage } from './components/MoodQuizPage'
import { SavedPage } from './components/SavedPage'
import { Toast } from './components/Toast'
import { WelcomeScreen } from './components/WelcomeScreen'
import type { Genre, Movie } from './types/movie'
import type { MovieReview, MovieReviewsById, ReviewDraft } from './types/review'
import type { Theme } from './types/theme'
import './App.css'

const THEME_STORAGE_KEY = 'kinopolka-theme'
const SAVED_STORAGE_KEY = 'kinopolka-saved'
const REVIEWS_STORAGE_KEY = 'kinopolka-reviews'
const INTRO_STORAGE_KEY = 'kinopolka-intro-seen'
const EDITORIAL_PAGE_SIZE = 10
const editorialGenres = ['драма', 'комедия', 'фантастика', 'триллер'] as const

type EditorialGenre = (typeof editorialGenres)[number]
type EditorialSelection = {
  index: number
  movies: Movie[]
}

function getRandomEditorialMovies(movies: Movie[], genre: EditorialGenre) {
  const sameGenreMovies = movies.filter((movie) => movie.genres.includes(genre))
  const shuffledMovies = [...sameGenreMovies]

  for (let index = shuffledMovies.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledMovies[index], shuffledMovies[randomIndex]] = [
      shuffledMovies[randomIndex],
      shuffledMovies[index],
    ]
  }

  return shuffledMovies.slice(0, EDITORIAL_PAGE_SIZE)
}

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitialSavedIds(): Set<string> {
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_STORAGE_KEY) ?? '[]')
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [])
  } catch {
    return new Set()
  }
}

function isMovieReview(value: unknown): value is MovieReview {
  if (!value || typeof value !== 'object') return false

  const review = value as Record<string, unknown>
  return (
    typeof review.id === 'string' &&
    typeof review.author === 'string' &&
    typeof review.comment === 'string' &&
    typeof review.createdAt === 'string' &&
    typeof review.rating === 'number' &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5
  )
}

function getInitialReviewsByMovie(): MovieReviewsById {
  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(REVIEWS_STORAGE_KEY) ?? '{}')
    if (!storedValue || typeof storedValue !== 'object' || Array.isArray(storedValue)) return {}

    const reviewsByMovieId: MovieReviewsById = {}
    Object.entries(storedValue).forEach(([movieId, reviews]) => {
      if (!Array.isArray(reviews)) return

      const validReviews = reviews.filter(isMovieReview)
      if (validReviews.length > 0) reviewsByMovieId[movieId] = validReviews
    })

    return reviewsByMovieId
  } catch {
    return {}
  }
}

function App() {
  const [activeView, setActiveView] = useState<AppView>('home')
  const [activeGenre, setActiveGenre] = useState<Genre>('драма')
  const [editorialSelection, setEditorialSelection] = useState<EditorialSelection>({ index: 0, movies: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalMovie, setModalMovie] = useState<Movie | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [reviewsByMovieId, setReviewsByMovieId] = useState<MovieReviewsById>(getInitialReviewsByMovie)
  const [savedIds, setSavedIds] = useState<Set<string>>(getInitialSavedIds)
  const [showWelcome, setShowWelcome] = useState(
    () => window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true',
  )
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadCatalog = useCallback(() => {
    setIsLoading(true)
    setLoadError(null)

    fetchMovies()
      .then((nextMovies) => {
        setMovies(nextMovies)
        setEditorialSelection({
          index: 0,
          movies: getRandomEditorialMovies(nextMovies, editorialGenres[0]),
        })
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Попробуйте загрузить каталог ещё раз.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadCatalog, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadCatalog])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify([...savedIds]))
  }, [savedIds])

  useEffect(() => {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsByMovieId))
  }, [reviewsByMovieId])

  useEffect(() => {
    if (!toastMessage) return
    const timeoutId = window.setTimeout(() => setToastMessage(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const editorialMovies = editorialSelection.movies

  const popularMovies = useMemo(
    () => [...movies].sort((first, second) => second.rating - first.rating).slice(0, 10),
    [movies],
  )

  const navigate = (view: AppView) => {
    setActiveView(view)
    setShowWelcome(false)
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true')
    window.requestAnimationFrame(() => {
      const content = document.getElementById('app-content')
      if (!content) return

      const header = document.querySelector<HTMLElement>('.glass-header')
      const headerOffset = (header?.getBoundingClientRect().height ?? 68) + 26
      const contentTop = content.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: Math.max(0, contentTop - headerOffset),
        behavior: 'smooth',
      })
    })
  }

  const toggleSaved = (movie: Movie) => {
    setSavedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(movie.id)) {
        nextIds.delete(movie.id)
        setToastMessage(`«${movie.title}» убран из списка`)
      } else {
        nextIds.add(movie.id)
        setToastMessage(`«${movie.title}» добавлен в «Посмотреть позже»`)
      }
      return nextIds
    })
  }

  const openGenre = (genre: Genre) => {
    setActiveGenre(genre)
    navigate('genre')
  }

  const watchMovie = (movie: Movie) => {
    const openedWindow = window.open(movie.watchUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      window.location.assign(movie.watchUrl)
      return
    }

    setModalMovie(null)
    setToastMessage(`Открываем «${movie.title}» на Rutube`)
  }

  const addReview = (movie: Movie, draft: ReviewDraft) => {
    const review: MovieReview = {
      ...draft,
      id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    setReviewsByMovieId((currentReviews) => ({
      ...currentReviews,
      [movie.id]: [...(currentReviews[movie.id] ?? []), review],
    }))
    setToastMessage(`Ваш отзыв о «${movie.title}» добавлен`)
  }

  return (
    <div className={`app-shell ${showWelcome ? 'is-welcome' : ''}`}>
      <GlassHeader
        activeView={activeView}
        onNavigate={navigate}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
        theme={theme}
      />

      {showWelcome ? (
        <WelcomeScreen onContinue={() => navigate('home')} />
      ) : (
        <div className="app-content" id="app-content">
          {isLoading && <LoadingState />}
          {!isLoading && loadError && <ErrorState message={loadError} onRetry={loadCatalog} />}
          {!isLoading && !loadError && activeView === 'home' && (
            <HomePage
              editorialMovies={editorialMovies}
              onRefresh={() =>
                setEditorialSelection((currentSelection) => {
                  const nextIndex = currentSelection.index + 1
                  const nextGenre = editorialGenres[nextIndex % editorialGenres.length]

                  return {
                    index: nextIndex,
                    movies: getRandomEditorialMovies(movies, nextGenre),
                  }
                })
              }
              onStartMoodQuiz={() => navigate('mood')}
              onOpenGenre={openGenre}
              onSelect={setModalMovie}
              onToggleSaved={toggleSaved}
              popularMovies={popularMovies}
              savedIds={savedIds}
            />
          )}
          {!isLoading && !loadError && activeView === 'catalog' && (
            <CatalogPage
              movies={movies}
              onSelect={setModalMovie}
              onToggleSaved={toggleSaved}
              savedIds={savedIds}
            />
          )}
          {!isLoading && !loadError && activeView === 'mood' && (
            <MoodQuizPage
              movies={movies}
              onBack={() => navigate('home')}
              onSelect={setModalMovie}
              onToggleSaved={toggleSaved}
              savedIds={savedIds}
            />
          )}
          {!isLoading && !loadError && activeView === 'genre' && (
            <GenrePage
              genre={activeGenre}
              movies={movies}
              onBack={() => navigate('home')}
              onSelect={setModalMovie}
              onToggleSaved={toggleSaved}
              savedIds={savedIds}
            />
          )}
          {!isLoading && !loadError && activeView === 'saved' && (
            <SavedPage
              movies={movies}
              onSelect={setModalMovie}
              onToggleSaved={toggleSaved}
              savedIds={savedIds}
            />
          )}
        </div>
      )}

      {modalMovie && (
        <MovieModal
          key={modalMovie.id}
          movie={modalMovie}
          onAddReview={addReview}
          onClose={() => setModalMovie(null)}
          onToggleSaved={toggleSaved}
          onWatch={watchMovie}
          saved={savedIds.has(modalMovie.id)}
          userReviews={reviewsByMovieId[modalMovie.id] ?? []}
        />
      )}
      <Toast message={toastMessage} />
    </div>
  )
}

export default App
