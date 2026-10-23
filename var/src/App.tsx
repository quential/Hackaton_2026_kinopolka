import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMovies } from './api/movies'
import { CatalogPage } from './components/CatalogPage'
import { ErrorState } from './components/ErrorState'
import GlassHeader, { type AppView } from './components/GlassHeader'
import { HomePage } from './components/HomePage'
import { LoadingState } from './components/LoadingState'
import { MovieModal } from './components/MovieModal'
import { SavedPage } from './components/SavedPage'
import { Toast } from './components/Toast'
import { WelcomeScreen } from './components/WelcomeScreen'
import type { Movie } from './types/movie'
import type { Theme } from './types/theme'
import './App.css'

const THEME_STORAGE_KEY = 'kinopolka-theme'
const SAVED_STORAGE_KEY = 'kinopolka-saved'
const INTRO_STORAGE_KEY = 'kinopolka-intro-seen'

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

function App() {
  const [activeView, setActiveView] = useState<AppView>('home')
  const [editorialOffset, setEditorialOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalMovie, setModalMovie] = useState<Movie | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
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
      .then((nextMovies) => setMovies(nextMovies))
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
    if (!toastMessage) return
    const timeoutId = window.setTimeout(() => setToastMessage(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const editorialMovies = useMemo(() => {
    if (movies.length === 0) return []
    const curated = movies.filter((movie) => movie.isEditorsChoice)
    const source = curated.length >= 6 ? curated : movies
    const offset = editorialOffset % source.length
    return [...source.slice(offset), ...source.slice(0, offset)].slice(0, 7)
  }, [editorialOffset, movies])

  const popularMovies = useMemo(
    () => [...movies].sort((first, second) => second.rating - first.rating).slice(0, 10),
    [movies],
  )

  const navigate = (view: AppView) => {
    setActiveView(view)
    setShowWelcome(false)
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true')
    window.requestAnimationFrame(() => {
      document.getElementById('app-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  const watchMovie = (movie: Movie) => {
    setModalMovie(null)
    setToastMessage(`Запускаем «${movie.title}»`)
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
              onRefresh={() => setEditorialOffset((offset) => offset + 1)}
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

      <MovieModal
        movie={modalMovie}
        onClose={() => setModalMovie(null)}
        onToggleSaved={toggleSaved}
        onWatch={watchMovie}
        saved={modalMovie ? savedIds.has(modalMovie.id) : false}
      />
      <Toast message={toastMessage} />
    </div>
  )
}

export default App
