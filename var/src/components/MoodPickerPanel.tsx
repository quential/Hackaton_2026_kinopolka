type MoodPickerPanelProps = {
  onStart: () => void
}

export function MoodPickerPanel({ onStart }: MoodPickerPanelProps) {
  return (
    <section aria-labelledby="mood-picker-title" className="mood-picker content-section">
      <div className="mood-picker__copy">
        <h2 id="mood-picker-title">Подобрать фильм под настроение</h2>
        <p>Ответьте на несколько вопросов — и мы найдём фильм, который подойдёт именно этому вечеру.</p>
        <button className="button button--primary mood-picker__button" onClick={onStart} type="button">
          Подобрать
        </button>
      </div>
    </section>
  )
}
