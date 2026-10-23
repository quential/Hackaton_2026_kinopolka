import type { CSSProperties } from 'react'

export type IconName =
  | 'arrow-down'
  | 'bookmark'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'close'
  | 'moon'
  | 'play'
  | 'refresh'
  | 'search'
  | 'sliders'
  | 'star'
  | 'sun'

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

function Icon({ name, size = 20, className = '' }: IconProps) {
  const style = {
    '--icon-size': `${size}px`,
    '--icon-url': `url('/icons/${name}.svg')`,
  } as CSSProperties

  return (
    <span
      aria-hidden="true"
      className={`icon icon--${name} ${className}`.trim()}
      style={style}
    />
  )
}

export default Icon
