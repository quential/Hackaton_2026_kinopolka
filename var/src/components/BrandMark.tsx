type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <img
      aria-hidden="true"
      className={`brand-mark ${className}`}
      src="/brand/kinopolka-logo.png"
      alt=""
    />
  )
}
