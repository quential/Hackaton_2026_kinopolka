export function LoadingState() {
  return (
    <div aria-live="polite" className="state-panel state-panel--loading">
      <span className="loading-orb" />
      <div>
        <strong>Собираем фильмы на вечер</strong>
        <p>Ещё немного — и можно выбирать.</p>
      </div>
    </div>
  )
}
