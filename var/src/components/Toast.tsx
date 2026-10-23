type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div aria-live="polite" className="toast" role="status">
      {message}
    </div>
  )
}
