type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={`brand-mark ${className}`}
      fill="none"
      viewBox="0 0 42 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 28.5h36" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      <path d="M7 26V9.5h6V26M16 26V4h7v22M27 26V12l6 3.5V26" fill="currentColor" />
    </svg>
  )
}
