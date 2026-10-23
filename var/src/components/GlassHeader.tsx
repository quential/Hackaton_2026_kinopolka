import type { Theme } from '../types/theme'
import Icon from './Icon'
import { BrandMark } from './BrandMark'

export type AppView = 'home' | 'catalog' | 'saved' | 'mood' | 'genre'

type GlassHeaderProps = {
  activeView: AppView
  onNavigate: (view: AppView) => void
  onToggleTheme: () => void
  theme: Theme
}

const navItems: Array<{ label: string; view: AppView }> = [
  { label: 'Подборки', view: 'home' },
  { label: 'Каталог', view: 'catalog' },
  { label: 'Посмотреть позже', view: 'saved' },
]

export function GlassHeader({
  activeView,
  onNavigate,
  onToggleTheme,
  theme,
}: GlassHeaderProps) {
  const activeNavView = activeView === 'mood' || activeView === 'genre' ? 'home' : activeView

  return (
    <header className="glass-header">
      <button
        aria-label="Кинополка — на главную"
        className="brand-button"
        onClick={() => onNavigate('home')}
        type="button"
      >
        <BrandMark />
      </button>

      <nav aria-label="Основная навигация" className="primary-nav">
        {navItems.map((item) => (
          <button
            aria-current={activeNavView === item.view ? 'page' : undefined}
            className={`nav-link ${activeNavView === item.view ? 'is-active' : ''}`}
            key={item.view}
            onClick={() => onNavigate(item.view)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        aria-pressed={theme === 'dark'}
        className={`theme-switch theme-switch--${theme}`}
        onClick={onToggleTheme}
        type="button"
      >
        <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={16} />
      </button>
    </header>
  )
}

export default GlassHeader
