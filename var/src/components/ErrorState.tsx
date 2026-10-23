type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div aria-live="assertive" className="state-panel state-panel--error" role="alert">
      <div>
        <strong>Не удалось загрузить каталог</strong>
        <p>{message}</p>
      </div>
      <button className="button button--secondary" onClick={onRetry} type="button">
        Повторить
      </button>
    </div>
  )
}
